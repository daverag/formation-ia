import { execSync } from 'node:child_process';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('');
console.log('Ce reset remet les fichiers suivis par Git au dernier commit stable.');
console.log('Les changements non enregistrés seront perdus.');
console.log('');

rl.question('Tapez RESET pour continuer : ', (answer) => {
  if (answer !== 'RESET') {
    console.log('Reset annulé.');
    rl.close();
    return;
  }

  try {
    execSync('git reset --hard HEAD', { stdio: 'inherit' });
    console.log('Projet revenu à la dernière version stable.');
  } catch {
    console.log('Reset impossible. Vérifiez que Git est bien initialisé.');
  } finally {
    rl.close();
  }
});
