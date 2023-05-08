const fs = require("fs");
const DB_FILE_PATH = ".\core\db";

console.log('[CRUD]');

function create(content) {
    //Salvar o content no sistema
    fs.writeFileSync(DB_FILE_PATH, content);
    return content;
}

// [SIMULATION]
console.log(create("Hoje eu preciso tomar banho"));