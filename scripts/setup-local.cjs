const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const templatePath = path.join(repoRoot, 'backend', '.env.example');
const envPath = path.join(repoRoot, 'backend', '.env');

if (fs.existsSync(envPath)) {
  console.log('backend/.env ya existe; se conserva sin cambios.');
  process.exit(0);
}

const template = fs.readFileSync(templatePath, 'utf8');
if (!/^JWT_SECRET=.*$/m.test(template)) {
  throw new Error('No se encontró JWT_SECRET en backend/.env.example');
}

const localSecret = crypto.randomBytes(32).toString('hex');
const localConfig = template.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${localSecret}`);
fs.writeFileSync(envPath, localConfig, { flag: 'wx' });
console.log('Creado backend/.env con un JWT_SECRET aleatorio. El archivo está excluido de Git.');
