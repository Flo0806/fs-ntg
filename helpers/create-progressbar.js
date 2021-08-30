const colors = require("colors");
const readline = require("readline");
const {
  hideCursor,
  showCursor,
  moveCursor,
  MOVE_CURSOR_UP,
} = require("./cursor-handler");

const _max = 20;
let _currentState = 0;

function wait(ms) {
  return new Promise((res) =>
    setTimeout(() => {
      res();
    }, ms)
  );
}

function addPercentToProgress(addPercent, infoText, close = false) {
  return new Promise(async (res) => {
    _currentState += parseFloat(addPercent / 5);
    if (close) {
      _currentState = _max;
    }
    if (_currentState <= _max) {
      const dots = "\u2588".repeat(_currentState);
      const left = _max - _currentState;
      const empty = "\u2591".repeat(left);

      process.stdout.clearLine();
      process.stdout.write(
        `\r[${dots}${empty}] ${
          close ? "100" : parseInt(_currentState * (100 / _max))
        }% ${infoText.bold.yellow}`
      );
    }
    if (_currentState >= _max) {
      await wait(1000);
      moveCursor(MOVE_CURSOR_UP, 1);
      readline.cursorTo(process.stdout, 0);
      readline.clearScreenDown(process.stdout);
      showCursor();
    }

    res();
  });
}

async function createProgressbar() {
  const dots = "\u2588".repeat(0);
  const left = _max;
  const empty = "\u2591".repeat(left);

  process.stdout.write(`\r[${dots}${empty}] 0%`);
  hideCursor();
}

module.exports.createProgressbar = createProgressbar;
module.exports.addPercentToProgress = addPercentToProgress;
