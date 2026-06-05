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

console.log('Modifying welcome modal trigger on load...');

replaceInFile(scriptPath,
`  const langChosen = localStorage.getItem("phh_lang_chosen");
  const modal = document.getElementById("initial-lang-modal");
  if (!langChosen && modal) {
    modal.style.display = "flex";
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  } else if (modal) {
    modal.style.display = "none";
    modal.classList.remove("active");
  }`,
`  const modal = document.getElementById("initial-lang-modal");
  if (modal) {
    modal.style.display = "flex";
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }`
);

console.log('Finished modifying script.js.');
