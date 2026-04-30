import { spawn } from 'node:child_process';

const extraArgs = process.argv.slice(2);
const processes = [
  {
    name: 'backend',
    command: 'npm',
    args: ['run', 'backend'],
  },
  {
    name: 'frontend',
    command: 'npm',
    args: ['run', 'dev:vite', '--', ...extraArgs],
  },
];

const children = processes.map((processConfig) => {
  const child = spawn(processConfig.command, processConfig.args, {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('error', (error) => {
    console.error(`${processConfig.name} n'a pas demarre: ${error.message}`);
    stopAll(1);
  });

  child.on('exit', (code, signal) => {
    if (stopping) return;

    if (signal) {
      stopAll(0);
      return;
    }

    stopAll(code ?? 0);
  });

  return child;
});

let stopping = false;

function stopAll(code) {
  if (stopping) return;
  stopping = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }

  setTimeout(() => process.exit(code), 100);
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
