const fs = require('fs');

const serverContent = fs.readFileSync('d:/Hospital_Website_HTML/server.js', 'utf8');
const scriptContent = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');

console.log('=== Server.js occurrences ===');
const serverLines = serverContent.split('\n');
serverLines.forEach((line, index) => {
    if (line.toLowerCase().includes('message') || line.toLowerCase().includes('contact') || line.toLowerCase().includes('inquiry')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});

console.log('=== js/script.js occurrences ===');
const scriptLines = scriptContent.split('\n');
scriptLines.forEach((line, index) => {
    if (line.toLowerCase().includes('contact') && (line.toLowerCase().includes('submit') || line.toLowerCase().includes('form') || line.toLowerCase().includes('send'))) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});
