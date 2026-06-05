const fs = require('fs');
const content = fs.readFileSync('js/script.js', 'utf8').replace(/\r\n/g, '\n');
const lines = content.split('\n');

console.log("=== EN SECTION ===");
for (let i = 15; i < 30; i++) {
  console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
}

console.log("=== GU SECTION ===");
for (let i = 200; i < 225; i++) {
  console.log(`${i+1}: ${JSON.stringify(lines[i])}`);
}
