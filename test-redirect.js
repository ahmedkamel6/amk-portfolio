const url = 'https://drive.google.com/uc?export=download&id=1gtwkh1YCUmO5KFMK_J0dd2c4nAdxMhOB&confirm=t';
fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
.then(res => {
  console.log('Status:', res.status, res.headers.get('content-type'));
  return res.text();
})
.then(html => {
  const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
  console.log('UUID:', uuidMatch ? uuidMatch[1] : 'Not found');
})
