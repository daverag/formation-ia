import { getProjectRef, isFilled, readEnvFile, writeEnvFile } from './env.js';

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

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/api-keys?reveal=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error('Impossible de récupérer les clés Supabase. Vérifiez le token.');
  }

  const keys = await response.json();
  const anonKey =
    keys.find((key) => key.name === 'anon') ||
    keys.find((key) => key.prefix === 'anon') ||
    keys.find((key) => key.type === 'publishable') ||
    {};

  const serviceRoleKey =
    keys.find((key) => key.name === 'service_role') ||
    keys.find((key) => key.prefix === 'service_role') ||
    keys.find((key) => key.secret_jwt_template?.role === 'service_role') ||
    {};

  if (!anonKey.api_key || !serviceRoleKey.api_key) {
    throw new Error('Les clés anon et service_role sont introuvables.');
  }

  await writeEnvFile({
    ...env,
    VITE_SUPABASE_ANON_KEY: anonKey.api_key,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey.api_key,
  });

  console.log('Configuration Supabase prête.');
}

main().catch((error) => {
  console.error('');
  console.error(error.message);
  console.error('');
  process.exit(1);
});
