async function test() {
  const id = '1o1WL677agXFMABOPLnNa-IhCPU2uFJcc'; 
  const res = await fetch('https://drive.google.com/get_video_info?docid=' + id);
  const text = await res.text();
  const params = new URLSearchParams(text);
  const streamMap = params.get('fmt_stream_map');
  if (streamMap) {
    console.log('Stream map found!');
    streamMap.split(',').forEach(s => {
      const parts = s.split('|');
      console.log('Format:', parts[0], 'URL:', parts[1].substring(0, 100) + '...');
    });
  } else {
    console.log('No stream map:', text);
  }
}
test();
