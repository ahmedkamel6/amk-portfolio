const id = '1gtwkh1YCUmO5KFMK_J0dd2c4nAdxMhOB';
const url = 'https://drive.google.com/uc?export=download&id=' + id;
fetch(url)
.then(res => res.text())
.then(html => {
  console.log('UUID Match Regex:', html.match(/name="uuid"\s+value="([^"]+)"/));
  console.log('Action URL Regex:', html.match(/action="([^"]+)"/));
  const formHtml = html.substring(html.indexOf('<form'), html.indexOf('</form>') + 7);
  console.log('Form HTML:', formHtml);
})
