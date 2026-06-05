const fs = require('fs');
const files = ['js/patient.js', 'js/doctor.js', 'js/admin.js', 'js/receptionist.js'];

files.forEach(f => {
    try {
        const content = fs.readFileSync('d:/Hospital_Website_HTML/' + f, 'utf8');
        const hasTranslate = content.includes('data-translate') || content.includes('TRANSLATIONS') || content.includes('setLanguage');
        console.log(`File: ${f} - Has translation logic: ${hasTranslate}`);
    } catch(e) {
        console.log(`File: ${f} - Error reading: ${e.message}`);
    }
});
