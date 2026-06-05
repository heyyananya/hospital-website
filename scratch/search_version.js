const fs = require('fs');
const path = require('path');

const dir = 'd:/Hospital_Website_HTML';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const matches = content.match(/\?v=\d+/g);
        if (matches) {
            console.log(`File: ${file} - Matches:`, matches);
        }
    }
});
