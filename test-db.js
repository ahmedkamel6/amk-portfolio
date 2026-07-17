const { Client } = require('pg');
const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const dbUrl = env.split('\n').find(l => l.startsWith('DATABASE_URL')).split('=')[1].replace(/['"]/g, '').trim();

const client = new Client({ connectionString: dbUrl });
client.connect().then(() => {
  return client.query('SELECT title, "driveUrl" FROM "Project" WHERE title = \'New Project\'');
}).then(res => {
  console.log(res.rows);
  client.end();
}).catch(console.error);
