const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/js/script.js', 'utf8');

const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.includes('contact-form') || line.includes('contact-name') || line.includes('contact-email')) {
        console.log(`Line ${index + 1}: ${line}`);
    }
});
