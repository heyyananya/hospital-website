const fs = require('fs');
const path = require('path');

const dir = 'd:/Hospital_Website_HTML';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.includes('font-awesome') || line.includes('all.min.css')) {
                console.log(`File: ${file} Line ${index + 1}: ${line.trim()}`);
            }
        });
    }
});
