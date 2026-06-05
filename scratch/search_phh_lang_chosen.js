const fs = require('fs');
const path = require('path');

function search(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
        const full = path.join(dir, f);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            if (f !== 'node_modules' && f !== '.git' && f !== 'dist') search(full);
        } else if (f.endsWith('.js')) {
            const content = fs.readFileSync(full, 'utf8');
            if (content.includes('phh_lang_chosen')) {
                console.log(`Found phh_lang_chosen in: ${full}`);
            }
        }
    });
}

search('d:/Hospital_Website_HTML');
