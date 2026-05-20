const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Find and replace the direct Anthropic call in the vision block
// with a call to /api/generate passing visionImages array

const idx = html.indexOf('api.anthropic.com/v1/messages');
if(idx === -1) {
  console.log('No hay llamadas directas a api.anthropic.com — ya está corregido o no se insertó');
  process.exit(0);
}

// Show context to find exact string
console.log('Encontrada en posición:', idx);
const chunk = html.slice(idx - 300, idx + 400);
console.log('Contexto:\n', chunk);
