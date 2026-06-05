const fs = require('fs');
const lines = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8').split('\n');

lines.forEach((line, index) => {
    if (line.includes('DOMContentLoaded')) {
        console.log(`Line ${index + 1}: ${line}`);
    }
});
