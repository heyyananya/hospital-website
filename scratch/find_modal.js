const fs = require('fs');

const indexContent = fs.readFileSync('d:/Hospital_Website_HTML/index.html', 'utf8');
const scriptContent = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');

console.log('=== Index.html occurrences of lang modal/popup ===');
const indexLines = indexContent.split('\n');
indexLines.forEach((line, index) => {
    if (line.toLowerCase().includes('modal') || line.toLowerCase().includes('lang') || line.toLowerCase().includes('wizard')) {
        if (line.toLowerCase().includes('select') || line.toLowerCase().includes('welcome') || line.toLowerCase().includes('choose')) {
            console.log(`Line ${index + 1}: ${line.trim()}`);
        }
    }
});

console.log('=== js/script.js occurrences of lang modal ===');
const scriptLines = scriptContent.split('\n');
scriptLines.forEach((line, index) => {
    if (line.toLowerCase().includes('modal') && (line.toLowerCase().includes('lang') || line.toLowerCase().includes('wizard') || line.toLowerCase().includes('welcome'))) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
    }
});
