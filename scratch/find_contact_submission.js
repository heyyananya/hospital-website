const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');

const lines = content.split('\n');
let inside = false;
let count = 0;

lines.forEach((line, index) => {
    if (line.includes('contact') && (line.includes('submit') || line.includes('click') || line.includes('addEventListener') || line.includes('form'))) {
        console.log(`Line ${index + 1}: ${line}`);
    }
});

// Let's print around lines that refer to "contact" or "message" to see if there is a listener
console.log('=== Lines containing "contact" or "message" around DOM listeners ===');
lines.forEach((line, index) => {
    if (index > 1300 && index < 1650) {
        if (line.toLowerCase().includes('contact') || line.toLowerCase().includes('message')) {
            console.log(`Line ${index + 1}: ${line}`);
        }
    }
});
