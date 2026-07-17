import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs';

// Cache the final resolved direct streaming URL
const urlCache = new Map<string, { resolved: string; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Manually follows redirects to get the final download URL, 
 * bypassing virus scan warnings.
 */
async function getFinalUrl(initialUrl: string, id: string): Promise<string> {
  let currentUrl = initialUrl;
  let attempts = 0;
  
  while (attempts < 5) {
    const res = await fetch(currentUrl, {
      method: 'GET',
      redirect: 'manual', // Don't follow automatically, we need to intercept
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (location) {
        currentUrl = location.startsWith('http') ? location : new URL(location, currentUrl).toString();
        attempts++;
        continue;
      }
    }

    // Check if it's the virus scan HTML page
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      const html = await res.text();
      const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
      if (uuidMatch && uuidMatch[1]) {
        currentUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t&uuid=${uuidMatch[1]}`;
        attempts++;
        continue;
      }
    }

    // If 200 OK or 206, we found the final URL
    return currentUrl;
  }
  return currentUrl;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return new NextResponse('Missing url parameter', { status: 400 });

  try {
    let finalUrl = url;
    
    if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
      const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const id = match[1];
        
        // Check cache for final streaming URL
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

    // Now fetch from the FINAL URL, passing the Range header
    const fetchHeaders = new Headers();
    fetchHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    
    const rangeHeader = req.headers.get('range');
    if (rangeHeader) {
      fetchHeaders.set('Range', rangeHeader);
    }

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: fetchHeaders,
      redirect: 'follow'
    });

    // Pipe response headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-disposition'); // CRITICAL: Fixes NotSupportedError on Desktop
    responseHeaders.set('content-type', 'video/mp4');
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(response.body, {
      status: response.status, // Should be 206 if Range was sent
      statusText: response.statusText,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('Video proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
