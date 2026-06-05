const fs = require('fs');

const indexContent = fs.readFileSync('d:/Hospital_Website_HTML/index.html', 'utf8');

console.log('=== Index.html "Inside" section occurrences ===');
const indexLines = indexContent.split('\n');
let foundSection = false;
let count = 0;
indexLines.forEach((line, index) => {
    if (line.toLowerCase().includes('inside') && line.toLowerCase().includes('consultation')) {
        foundSection = true;
    }
    if (line.toLowerCase().includes('emergency ward') || line.toLowerCase().includes('opd waiting lounge')) {
        foundSection = true;
    }
    if (foundSection) {
        console.log(`Line ${index + 1}: ${line}`);
        count++;
        if (count > 50) {
            foundSection = false;
        }
    }
});
