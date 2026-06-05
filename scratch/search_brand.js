const fs = require('fs');
const path = require('path');

function searchFiles(dir, pattern) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
                searchFiles(fullPath, pattern);
            }
        } else if (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(pattern)) {
                console.log(`Found "${pattern}" in: ${fullPath}`);
            }
        }
    }
}

console.log('Searching for "brand-logo"...');
searchFiles('d:/Hospital_Website_HTML', 'brand-logo');

console.log('Searching for "brand"...');
searchFiles('d:/Hospital_Website_HTML', 'brand');
