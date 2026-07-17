const id = '1gtwkh1YCUmO5KFMK_J0dd2c4nAdxMhOB';
const url = 'https://drive.google.com/uc?export=download&id=' + id;
fetch(url)
.then(res => res.text())
.then(html => {
  const uuidMatch = html.match(/name="uuid"\s+value="([^"]+)"/);
  if (uuidMatch && uuidMatch[1]) {
    const directUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t&uuid=${uuidMatch[1]}`;
    console.log('Fetching:', directUrl);
    return fetch(directUrl);
  }
})
.then(res => {
  console.log('Direct URL Status:', res.status, res.headers.get('content-type'));
})
