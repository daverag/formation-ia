import { readFile, writeFile } from 'node:fs/promises';

export async function readEnvFile(path = '.env') {
  try {
    const content = await readFile(path, 'utf8');
    return Object.fromEntries(
      content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const index = line.indexOf('=');
          return [line.slice(0, index), line.slice(index + 1)];
        })
    );
  } catch {
    return {};
  }
}

export async function writeEnvFile(values, path = '.env') {
  const lines = [
    `APP_PORT=${values.APP_PORT || '8080'}`,
    '',
    `VITE_SUPABASE_URL=${values.VITE_SUPABASE_URL || ''}`,
    `VITE_SUPABASE_ANON_KEY=${values.VITE_SUPABASE_ANON_KEY || ''}`,
    '',
    '# Clés privées locales. Ne jamais les utiliser dans le code React.',
    `SUPABASE_SERVICE_ROLE_KEY=${values.SUPABASE_SERVICE_ROLE_KEY || ''}`,
    `SUPABASE_ACCESS_TOKEN=${values.SUPABASE_ACCESS_TOKEN || ''}`,
    '',
    `ADMIN_EMAIL=${values.ADMIN_EMAIL || 'admin@boilerplate.local'}`,
    '',
  ];

  await writeFile(path, lines.join('\n'), 'utf8');
}

export function getProjectRef(supabaseUrl) {
  try {
    return new URL(supabaseUrl).hostname.split('.')[0];
  } catch {
    return '';
  }
}

export function isFilled(value) {
  return Boolean(value) && !value.includes('remplacez');
}
