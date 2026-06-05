const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/css/style.css', 'utf8');

const lines = content.split('\n');
let inside = false;
let count = 0;
lines.forEach((line, index) => {
    if (line.includes('/* FAQ') || line.includes('.faq-')) {
        inside = true;
    }
    if (inside) {
        console.log(`Line ${index + 1}: ${line}`);
        count++;
        if (count > 80) {
            inside = false;
        }
    }
});
