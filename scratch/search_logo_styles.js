const fs = require('fs');
const lines = fs.readFileSync('d:/Hospital_Website_HTML/css/style.css', 'utf8').split('\n');

lines.forEach((line, index) => {
    if (line.includes('.logo')) {
        console.log(`Line ${index + 1}: ${line}`);
    }
});
