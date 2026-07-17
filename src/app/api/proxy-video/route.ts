import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  try {
    let finalUrl = url;
    if (url.includes('drive.google.com')) {
      const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        const id = match[1];
        finalUrl = `https://drive.google.com/uc?export=download&id=${id}&confirm=t`;
        
        // Fetch to see if it gives us the virus scan warning
        const fetchRes = await fetch(finalUrl, {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        let directUrl = finalUrl;
        
        // If it returns HTML, it's the virus scan page, extract UUID
        if (fetchRes.ok && fetchRes.headers.get('content-type')?.includes('text/html')) {
          const html = await fetchRes.text();
          const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
          if (uuidMatch && uuidMatch[1]) {
            directUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t&uuid=${uuidMatch[1]}`;
          } else {
            // fallback if html but no uuid
            directUrl = fetchRes.url;
          }
        } else if (fetchRes.url) {
          // If it was already a direct download
          directUrl = fetchRes.url;
        }

        // Now we PROXY the actual video stream to bypass CORS, IP mismatch, and Content-Disposition locks
        const range = req.headers.get('range');
        const fetchHeaders: HeadersInit = { 
          'User-Agent': 'Mozilla/5.0',
          'Accept': '*/*'
        };
        if (range) {
          fetchHeaders['Range'] = range;
        }

        const directRes = await fetch(directUrl, { 
          headers: fetchHeaders,
          redirect: 'follow' 
        });

        const responseHeaders = new Headers();
        // Force the video mime type so browser doesn't treat it as a download
        responseHeaders.set('Content-Type', 'video/mp4');
        responseHeaders.set('Accept-Ranges', 'bytes');
        
        if (directRes.headers.get('content-length')) {
          responseHeaders.set('Content-Length', directRes.headers.get('content-length') as string);
        }
        if (directRes.headers.get('content-range')) {
          responseHeaders.set('Content-Range', directRes.headers.get('content-range') as string);
        }

        // Return the stream directly
        return new NextResponse(directRes.body, {
          status: directRes.status,
          headers: responseHeaders
        });
      }
    }

    // Fallback: just redirect to the URL if it's not Google Drive
    return NextResponse.redirect(finalUrl);

  } catch (error) {
    console.error('Video proxy error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
