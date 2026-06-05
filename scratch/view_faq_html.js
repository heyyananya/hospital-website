const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/index.html', 'utf8');

const lines = content.split('\n');
let inside = false;
let count = 0;
lines.forEach((line, index) => {
    if (line.includes('id="faq"') || line.includes('class="faq"')) {
        inside = true;
    }
    if (inside) {
        console.log(`Line ${index + 1}: ${line}`);
        count++;
        if (line.includes('</section>') && count > 10) {
            inside = false;
        }
    }
});
