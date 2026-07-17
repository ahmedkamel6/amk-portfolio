import type { NextApiRequest, NextApiResponse } from 'next';
import https from 'https';
import http from 'http';
import { URL } from 'url';

// Cache the final resolved direct streaming URL
const urlCache = new Map<string, { resolved: string; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Manually follows redirects to get the final download URL, 
 * bypassing virus scan warnings.
 */
function getFinalUrl(initialUrl: string, id: string): Promise<string> {
  return new Promise((resolve) => {
    let currentUrl = initialUrl;
    let attempts = 0;

    const follow = () => {
      if (attempts >= 5) {
        resolve(currentUrl);
        return;
      }

      const parsedUrl = new URL(currentUrl);
      const requestModule = parsedUrl.protocol === 'https:' ? https : http;

      const req = requestModule.get(currentUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
          const location = res.headers.location;
          if (location) {
            currentUrl = location.startsWith('http') ? location : new URL(location, currentUrl).toString();
            attempts++;
            follow();
            return;
          }
        }

        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('text/html')) {
          let html = '';
          res.on('data', chunk => html += chunk);
          res.on('end', () => {
            const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
            if (uuidMatch && uuidMatch[1]) {
              currentUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t&uuid=${uuidMatch[1]}`;
              attempts++;
              follow();
            } else {
              resolve(currentUrl);
            }
          });
          return;
        }

        // It's the video stream
        resolve(currentUrl);
      });

      req.on('error', () => resolve(currentUrl));
    };

    follow();
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string;
  if (!url) return res.status(400).send('Missing url parameter');

  let finalUrl = url;

  if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const id = match[1];
      const cached = urlCache.get(id);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        finalUrl = cached.resolved;
      } else {
        const initialUrl = `https://drive.google.com/uc?export=download&id=${id}&confirm=t`;
        finalUrl = await getFinalUrl(initialUrl, id);
        urlCache.set(id, { resolved: finalUrl, timestamp: Date.now() });
      }
    }
  }

  const parsedUrl = new URL(finalUrl);
  const requestModule = parsedUrl.protocol === 'https:' ? https : http;

  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  if (req.headers.range) {
    headers['Range'] = req.headers.range;
  }

  const proxyReq = requestModule.get(finalUrl, { headers }, (proxyRes) => {
    // Copy headers from Google Drive
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      if (key.toLowerCase() === 'content-disposition') continue; // STRIP THIS!
      if (value) res.setHeader(key, value as string | string[]);
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(proxyRes.statusCode || 200);

    // Pipe the raw native Node.js stream directly to the response
    // Zero latency, zero buffering!
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Video stream error:', err);
    if (!res.headersSent) {
      res.status(500).send('Internal Server Error');
    }
  });

  req.on('close', () => {
    proxyReq.destroy();
  });
}
