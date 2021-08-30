const { createChoisePrompt } = require("./helpers/create-choice-prompt");
const { createInputPrompt } = require("./helpers/create-input-promt");
//const rl = readline.createInterface(process.stdin, process.stdout);

async function main() {
  createInputPrompt("Ein kleine Frage      ")
    .then((data) => {
      console.log("Hallo " + data);
    })
    .then((data) => {
      console.log("FINISH", data);
    });
}

main();
