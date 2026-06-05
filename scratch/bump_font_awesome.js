const fs = require('fs');
const path = require('path');

const dir = 'd:/Hospital_Website_HTML';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        const oldCdn = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        const newCdn = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
        if (content.includes(oldCdn)) {
            content = content.replace(oldCdn, newCdn);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Successfully bumped Font Awesome in: ${file}`);
        }
    }
});
