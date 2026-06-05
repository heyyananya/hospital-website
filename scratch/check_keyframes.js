const fs = require('fs');
const content = fs.readFileSync('d:/Hospital_Website_HTML/css/style.css', 'utf8');

const regex = /@keyframes\s+slideDown/g;
if (regex.test(content)) {
    console.log('slideDown keyframes found in style.css');
} else {
    console.log('slideDown keyframes NOT found in style.css');
}
