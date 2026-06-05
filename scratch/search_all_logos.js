const fs = require('fs');
const path = require('path');

const dir = 'd:/Hospital_Website_HTML';
const files = fs.readdirSync(dir);
const keywords = ['navbar', 'logo', 'Superspeciality', 'Health Hub', 'Palanpur Health Hub'];

files.forEach(file => {
    if (file.endsWith('.html')) {
        const content = fs.readFileSync(path.join(dir, file), 'utf8');
        console.log(`=== File: ${file} ===`);
        keywords.forEach(kw => {
            const count = (content.match(new RegExp(kw, 'gi')) || []).length;
            if (count > 0) {
                console.log(`  - Keyword "${kw}" found ${count} times`);
            }
        });
    }
});
