import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  // Extract ID from Google Drive URL
  const match = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (!match || !match[1]) {
    return NextResponse.json({ error: 'Invalid Google Drive URL' }, { status: 400 })
  }

  const id = match[1]

  try {
    const infoRes = await fetch(`https://drive.google.com/get_video_info?docid=${id}`, {
      headers: {
        // Sometimes Google requires a specific user agent or accept language to return the stream map
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })
    
    const infoText = await infoRes.text()
    const params = new URLSearchParams(infoText)
    const fmtStreamMap = params.get('fmt_stream_map')
    
    if (!fmtStreamMap) {
      // Fallback if no streams found or blocked by Google
      return NextResponse.json({ 
        streams: [], 
        error: 'No stream map found', 
        rawText: infoText.substring(0, 200) 
      })
    }

    const streams: Array<{ quality: number, url: string }> = []
    
    // fmt_stream_map format: 'itag|url,itag|url'
    fmtStreamMap.split(',').forEach(s => {
      const parts = s.split('|')
      if (parts.length >= 2) {
        const itag = parseInt(parts[0], 10)
        const streamUrl = parts.slice(1).join('|') // In case URL contains '|'
        
        let quality = 0
        if (itag === 18) quality = 360
        else if (itag === 22) quality = 720
        else if (itag === 37) quality = 1080
        else if (itag === 59) quality = 480
        
        if (quality > 0) {
          // Decode URL (Google sometimes double-encodes it)
          let decodedUrl = streamUrl
          try { decodedUrl = decodeURIComponent(streamUrl) } catch (e) {}
          
          streams.push({ quality, url: decodedUrl })
        }
      }
    })

    // Sort descending by quality (1080 -> 720 -> 360)
    streams.sort((a, b) => b.quality - a.quality)

    return NextResponse.json({ streams })

  } catch (error) {
    console.error('Failed to fetch video streams:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
