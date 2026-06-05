const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/css/style.css', 'utf8');

const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.includes('modal-overlay')) {
        console.log(`Line ${index + 1}: ${line}`);
    }
});
