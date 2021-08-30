const colors = require("colors");
const { showCursor, moveCursor, MOVE_CURSOR_UP } = require("./cursor-handler");
const readline = require("readline");

function createInputPrompt(question) {
  return new Promise((resolve) => {
    const readlineInput = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    showCursor();
    readlineInput.question((question.trim() + " ").yellow.bold, (name) => {
      readlineInput.close();
      moveCursor(MOVE_CURSOR_UP, 1);
      readline.cursorTo(process.stdout, 0);
      readline.clearScreenDown(process.stdout);
      resolve(name);
    });
  });
}

module.exports.createInputPrompt = createInputPrompt;
