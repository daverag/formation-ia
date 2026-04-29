import { readFile } from 'node:fs/promises';
import { getProjectRef, isFilled, readEnvFile } from './env.js';

async function main() {
  const env = { ...(await readEnvFile()), ...process.env };
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const accessToken = env.SUPABASE_ACCESS_TOKEN;
  const projectRef = getProjectRef(supabaseUrl);

  if (!isFilled(supabaseUrl)) {
    throw new Error('VITE_SUPABASE_URL manque dans .env.');
  }

  if (!isFilled(accessToken)) {
    throw new Error('SUPABASE_ACCESS_TOKEN manque dans .env.');
  }

  const query = await readFile('supabase-schema.sql', 'utf8');
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || body.error || 'Migration Supabase impossible.');
  }

  console.log('Migration Supabase appliquée.');
}

main().catch((error) => {
  console.error('');
  console.error(error.message);
  console.error('');
  process.exit(1);
});
