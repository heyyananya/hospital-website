const fs = require('fs');
const path = require('path');

const dir = 'd:/Hospital_Website_HTML';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('?v=5')) {
            const updated = content.replace(/\?v=5/g, '?v=6');
            fs.writeFileSync(filePath, updated, 'utf8');
            console.log(`Successfully bumped version in: ${file}`);
        }
    }
});
