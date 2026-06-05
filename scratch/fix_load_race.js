const fs = require('fs');
const path = require('path');

const scriptPath = 'd:/Hospital_Website_HTML/js/script.js';

function replaceInFile(filePath, search, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedSearch = search.replace(/\r\n/g, '\n');
  const normalizedRepl = replacement.replace(/\r\n/g, '\n');

  if (!normalizedContent.includes(normalizedSearch)) {
    console.error(`ERROR: Target not found in ${path.basename(filePath)}!`);
    return false;
  }

  const updatedContent = normalizedContent.replace(normalizedSearch, normalizedRepl);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`SUCCESS: Replaced text in ${path.basename(filePath)}`);
  return true;
}

console.log('Fixing script.js race condition on load...');

replaceInFile(scriptPath,
`document.addEventListener("DOMContentLoaded", () => {
  autoExpireSlots();
  // Set initial language and populate doctors grid
  setLanguage(currentLanguage);
  
  const modal = document.getElementById("initial-lang-modal");
  if (modal) {
    modal.style.display = "flex";
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }
});`,
`function initHomepage() {
  autoExpireSlots();
  // Set initial language and populate doctors grid
  setLanguage(currentLanguage);
  
  const modal = document.getElementById("initial-lang-modal");
  if (modal) {
    modal.style.display = "flex";
    modal.style.opacity = "1";
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  initHomepage();
} else {
  document.addEventListener("DOMContentLoaded", initHomepage);
}`
);

console.log('Finished updating script.js.');
