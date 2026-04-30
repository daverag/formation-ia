import { execFileSync, execSync } from 'node:child_process';
import readline from 'node:readline';

const command = process.argv[2];
const text = process.argv.slice(3).join(' ').trim();
const mainBranch = 'main';
const workPrefix = 'work/';

function run(commandLine, options = {}) {
  return execSync(commandLine, {
    encoding: 'utf8',
    stdio: options.silent ? 'pipe' : 'inherit',
  });
}

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: 'inherit',
  });
}

function read(commandLine) {
  return run(commandLine, { silent: true }).trim();
}

function fail(message) {
  console.log('');
  console.log(message);
  process.exit(1);
}

function ensureGitRepository() {
  try {
    read('git rev-parse --is-inside-work-tree');
  } catch {
    fail('Ce dossier n’est pas un projet Git.');
  }
}

function currentBranch() {
  return read('git branch --show-current');
}

function hasChanges() {
  return read('git status --porcelain').length > 0;
}

function ensureCleanProject() {
  if (hasChanges()) {
    fail('Il y a déjà des changements non sauvegardés. Lancez npm run work:status pour les voir.');
  }
}

function ensureWorkBranch() {
  const branch = currentBranch();

  if (!branch.startsWith(workPrefix)) {
    fail('Vous devez être dans un travail commencé avec npm run work:start.');
  }

  return branch;
}

function ensureMessage(value, fallback) {
  if (value) {
    return value;
  }

  if (fallback) {
    return fallback;
  }

  fail('Ajoutez un court message entre guillemets.');
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function buildProject() {
  console.log('');
  console.log('Test du projet...');
  run('npm run build');
}

function commitChanges(message) {
  run('git add -A');
  git(['commit', '-m', message]);
}

function pushBranch(branch) {
  run(`git push -u origin ${branch}`);
}

function startWork() {
  const label = ensureMessage(text);
  const slug = slugify(label);

  if (!slug) {
    fail('Le nom du travail doit contenir au moins une lettre ou un chiffre.');
  }

  const branch = `${workPrefix}${slug}`;

  ensureCleanProject();

  console.log('');
  console.log('Préparation de la version stable...');
  run(`git switch ${mainBranch}`);
  run(`git pull --ff-only origin ${mainBranch}`);

  const existingBranches = read('git branch --list');
  if (existingBranches.includes(branch)) {
    fail(`Le travail ${branch} existe déjà.`);
  }

  console.log('');
  console.log(`Début du travail : ${label}`);
  run(`git switch -c ${branch}`);
  pushBranch(branch);

  console.log('');
  console.log('Travail prêt. Vous pouvez modifier le projet.');
}

function saveWork() {
  const branch = ensureWorkBranch();
  const message = ensureMessage(text);

  if (!hasChanges()) {
    fail('Aucun changement à sauvegarder.');
  }

  buildProject();
  commitChanges(message);
  pushBranch(branch);

  console.log('');
  console.log('Tout est sauvegardé sur GitHub.');
}

function finishWork() {
  const branch = ensureWorkBranch();
  const message = ensureMessage(text, `Terminer ${branch.replace(workPrefix, '')}`);

  if (hasChanges()) {
    buildProject();
    commitChanges(message);
    pushBranch(branch);
  } else {
    buildProject();
  }

  console.log('');
  console.log('Retour à la version stable...');
  run(`git switch ${mainBranch}`);
  run(`git pull --ff-only origin ${mainBranch}`);

  console.log('');
  console.log('Ajout du travail terminé...');
  git(['merge', '--no-ff', branch, '-m', message]);
  run(`git push origin ${mainBranch}`);
  run(`git branch -d ${branch}`);

  console.log('');
  console.log('Travail terminé et envoyé sur GitHub.');
}

function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function cancelWork() {
  const branch = ensureWorkBranch();

  console.log('');
  console.log('Cette action supprime les changements non sauvegardés du travail en cours.');
  const answer = await askConfirmation('Tapez ANNULER pour continuer : ');

  if (answer !== 'ANNULER') {
    console.log('Annulation interrompue.');
    return;
  }

  run('git reset --hard HEAD');
  run(`git switch ${mainBranch}`);
  run(`git branch -D ${branch}`);

  console.log('');
  console.log('Le travail en cours a été annulé.');
}

function status() {
  const branch = currentBranch();
  const statusLines = read('git status --short');

  console.log('');
  console.log(`Branche actuelle : ${branch || 'inconnue'}`);

  if (branch === mainBranch) {
    console.log('Vous êtes sur la version stable.');
  } else if (branch.startsWith(workPrefix)) {
    console.log('Vous êtes dans un travail en cours.');
  } else {
    console.log('Cette branche n’a pas été créée par le flux simple.');
  }

  console.log('');

  if (!statusLines) {
    console.log('Aucun changement non sauvegardé.');
    return;
  }

  console.log('Changements non sauvegardés :');
  console.log(statusLines);
}

ensureGitRepository();

switch (command) {
  case 'start':
    startWork();
    break;
  case 'save':
    saveWork();
    break;
  case 'finish':
    finishWork();
    break;
  case 'cancel':
    await cancelWork();
    break;
  case 'status':
    status();
    break;
  default:
    console.log('');
    console.log('Commandes disponibles :');
    console.log('npm run work:start "nom du changement"');
    console.log('npm run work:save "message"');
    console.log('npm run work:finish "message"');
    console.log('npm run work:cancel');
    console.log('npm run work:status');
    process.exit(command ? 1 : 0);
}
