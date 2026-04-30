import { existsSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

const isDocker = existsSync('/.dockerenv') || process.env.FORMATION_IA_IN_DOCKER === '1';
const extraArgs = process.argv.slice(2);

function run(command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });

  child.on('error', () => {
    process.exit(1);
  });
}

function dockerComposeExists() {
  const result = spawnSync('docker', ['compose', 'version'], {
    stdio: 'ignore',
  });

  return result.status === 0;
}

function runLocalProject() {
  run('npm', ['run', 'dev:local', '--', ...extraArgs]);
}

if (isDocker) {
  runLocalProject();
} else if (dockerComposeExists()) {
  const child = spawn('docker', ['compose', 'up'], {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    if (code === 0) {
      process.exit(0);
      return;
    }

    console.log('');
    console.log('Docker ne semble pas disponible. Lancement local du frontend et du backend.');
    runLocalProject();
  });

  child.on('error', () => {
    console.log('Docker ne semble pas disponible. Lancement local du frontend et du backend.');
    runLocalProject();
  });
} else {
  console.log('Docker ne semble pas disponible. Lancement local du frontend et du backend.');
  runLocalProject();
}
