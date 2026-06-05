const fs = require('fs');
const path = require('path');

const dir = 'd:/Hospital_Website_HTML/js';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.js')) {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        if (content.includes('contact-form') || content.includes('contact-name') || content.includes('contact-email')) {
            console.log(`Found references in JS file: ${file}`);
        }
    }
});
