import { readFile, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { getProjectRef, isFilled, readEnvFile } from './env.js';

const DEFAULT_ADMIN_EMAIL = 'admin@boilerplate.local';
const CREDENTIALS_FILE = '.admin-credentials.txt';

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  return Array.from(randomBytes(20), (byte) => chars[byte % chars.length]).join('');
}

async function getServiceRoleKey({ serviceRoleKey, accessToken, projectRef }) {
  if (isFilled(serviceRoleKey)) {
    return serviceRoleKey;
  }

  if (!isFilled(accessToken)) {
    return '';
  }

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/api-keys?reveal=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error('Impossible de récupérer la clé service_role avec le token Supabase.');
  }

  const keys = await response.json();
  return (
    keys.find((key) => key.name === 'service_role') ||
    keys.find((key) => key.prefix === 'service_role') ||
    keys.find((key) => key.secret_jwt_template?.role === 'service_role') ||
    {}
  ).api_key;
}

async function request(url, serviceRoleKey, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.msg || body.message || 'Action Supabase impossible.');
  }

  return body;
}

async function findUserByEmail({ supabaseUrl, serviceRoleKey, email }) {
  const body = await request(
    `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1000`,
    serviceRoleKey
  );

  const users = Array.isArray(body) ? body : body.users || [];
  return users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
}

async function main() {
  const env = { ...(await readEnvFile()), ...process.env };
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const projectRef = getProjectRef(supabaseUrl);
  const email = env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const password = generatePassword();

  if (!isFilled(supabaseUrl)) {
    throw new Error('Ajoutez VITE_SUPABASE_URL dans le fichier .env.');
  }

  const serviceRoleKey = await getServiceRoleKey({
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    accessToken: env.SUPABASE_ACCESS_TOKEN,
    projectRef,
  });

  if (!serviceRoleKey) {
    throw new Error('Ajoutez SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_ACCESS_TOKEN dans .env.');
  }

  const existingUser = await findUserByEmail({ supabaseUrl, serviceRoleKey, email });
  const payload = {
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Admin' },
    app_metadata: { role: 'admin' },
  };

  const user = existingUser
    ? await request(`${supabaseUrl}/auth/v1/admin/users/${existingUser.id}`, serviceRoleKey, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
    : await request(`${supabaseUrl}/auth/v1/admin/users`, serviceRoleKey, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

  const credentials = [
    'Compte admin',
    '',
    `Email : ${email}`,
    `Mot de passe : ${password}`,
    `Rôle : ${user.app_metadata?.role || 'admin'}`,
    `User ID : ${user.id}`,
    '',
    'Ce fichier est local et ignoré par Git.',
    'Si vous relancez docker compose run --rm app npm run setup-admin, un nouveau mot de passe sera généré.',
    '',
  ].join('\n');

  await writeFile(CREDENTIALS_FILE, credentials, 'utf8');

  console.log('');
  console.log('Compte admin prêt.');
  console.log('');
  console.log(`Email : ${email}`);
  console.log(`Mot de passe : ${password}`);
  console.log(`Rôle : ${user.app_metadata?.role || 'admin'}`);
  console.log(`User ID : ${user.id}`);
  console.log('');
  console.log(`Identifiants écrits dans ${CREDENTIALS_FILE}.`);
  console.log('Ce fichier est local et ignoré par Git.');
}

main().catch((error) => {
  console.error('');
  console.error(error.message);
  console.error('');
  process.exit(1);
});
