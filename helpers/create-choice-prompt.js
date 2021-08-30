const rl = require("readline");
var Writable = require("stream").Writable;
const colors = require("colors");
const {
  moveCursor,
  MOVE_CURSOR_UP,
  MOVE_CURSOR_DOWN,
  hideCursor,
  showCursor,
} = require("./cursor-handler");

//readline.emitKeypressEvents(process.stdin);

let currentLine;
let results = [];

function fillResultsFirstTime(awnsers) {
  awnsers.forEach((awnser) => {
    results.push(false);
  });
}

function drawLines(awnsers) {
  let startPositionMinus = currentLine - 2;

  if (startPositionMinus > 0) {
    moveCursor(MOVE_CURSOR_UP, startPositionMinus);
  }

  for (let i = 0; i < awnsers.length; i++) {
    if (i === currentLine - 2) {
      if (results[i]) {
        process.stdout.write("\r" + ">".green + "(X) " + awnsers[i]);
      } else {
        process.stdout.write("\r" + ">".green + "( ) " + awnsers[i]);
      }
    } else {
      if (results[i]) {
        process.stdout.write("\r (X) " + awnsers[i]);
      } else {
        process.stdout.write("\r ( ) " + awnsers[i]);
      }
    }
    //console.log(" ( ) " + awnser);
    moveCursor(MOVE_CURSOR_DOWN, 1);
  }
  moveCursor(MOVE_CURSOR_UP, awnsers.length - (currentLine - 2));
  //process.stdout.write("\r" + ">".green + "( ) " + awnsers[currentLine - 2]);
}

async function createChoisePrompt(question, awnsers) {
  var mutableStdout = new Writable({
    write: function (chunk, encoding, callback) {
      if (!this.muted) process.stdout.write(chunk, encoding);
      callback();
    },
  });
  mutableStdout.muted = true;

  const readlineChoice = require("readline").createInterface({
    input: process.stdin,
    output: mutableStdout,
    terminal: true,
  });

  return new Promise((resolve) => {
    //rl.emitKeypressEvents(process.stdin);
    readlineChoice.input.setRawMode(true);
    //process.stdin.setRawMode(true);
    //process.stdin.resume();
    hideCursor();
    fillResultsFirstTime(awnsers);

    for (let i = 0; i < awnsers.length + 2; i++) {
      console.log();
    }

    moveCursor(MOVE_CURSOR_UP, awnsers.length + 3);

    console.log(question.bold + " (Press <space> to select)");
    console.log();
    //awnsers.forEach((awnser) => {
    //  console.log(" ( ) " + awnser);
    //});
    currentLine = 2;
    drawLines(awnsers);
    //moveCursor(MOVE_CURSOR_UP, awnsers.length);

    //process.stdout.write("\033[" + awnsers.length + "A");
    // \033[<N>A - Move up N

    readlineChoice.input.on("keypress", onKeyPressHandler);

    function onKeyPressHandler(chunk, key) {
      if (key.ctrl && key.name === "c") {
        moveCursor(
          MOVE_CURSOR_UP,
          awnsers.length - (awnsers.length - (currentLine - 2)) + 2
        );
        rl.cursorTo(process.stdout, 0);
        rl.clearScreenDown(process.stdout);
        process.exit(); // eslint-disable-line no-process-exit
      } else if (key.name === "down") {
        if (currentLine < 2 + awnsers.length - 1) {
          currentLine++;
          moveCursor(MOVE_CURSOR_DOWN, 1);
        } else {
          currentLine = 2;
          moveCursor(MOVE_CURSOR_UP, awnsers.length - 1);
        }
        drawLines(awnsers);
      } else if (key.name === "up") {
        if (currentLine > 2) {
          currentLine--;
          moveCursor(MOVE_CURSOR_UP, 1);
        } else {
          currentLine = 2 + awnsers.length - 1;
          moveCursor(MOVE_CURSOR_DOWN, awnsers.length - 1);
        }
        drawLines(awnsers);
      } else if (key.name === "space") {
        results[currentLine - 2] = !results[currentLine - 2];
        drawLines(awnsers);
      } else if (key.name === "enter" || key.name === "return") {
        // readline.input.removeAllListeners();

        moveCursor(
          MOVE_CURSOR_UP,
          awnsers.length - (awnsers.length - (currentLine - 2)) + 2
        );
        rl.cursorTo(process.stdout, 0);
        rl.clearScreenDown(process.stdout);
        readlineChoice.input.removeListener("keypress", onKeyPressHandler);
        readlineChoice.close();

        showCursor();

        setTimeout(() => {
          resolve(results);
        });
      }
    }
  });
}

module.exports.createChoisePrompt = createChoisePrompt;
