const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/server.js', 'utf8');

const lines = content.split('\n');
lines.forEach((line, index) => {
    if (line.includes('CREATE TABLE')) {
        console.log(`Line ${index + 1}: ${line.trim()}`);
        // Let's print the next 15 lines of schema
        for (let i = 1; i <= 15; i++) {
            console.log(`  ${index + 1 + i}: ${lines[index + i].trim()}`);
        }
    }
});
