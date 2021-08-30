const MOVE_CURSOR_UP = "UP";
const MOVE_CURSOR_DOWN = "DOWN";
const MOVE_CURSOR_LEFT = "LEFT";
const MOVE_CURSOR_RIGHT = "RIGHT";

function moveCursor(direction, step = 1) {
  if (parseInt(step) < 0) {
    step = 1;
  }

  switch (direction) {
    case MOVE_CURSOR_UP:
      process.stdout.write("\033[" + step + "A");
      break;
    case MOVE_CURSOR_DOWN:
      process.stdout.write("\033[" + step + "B");
      break;
    case MOVE_CURSOR_RIGHT:
      process.stdout.write("\033[" + step + "C");
      break;
    case MOVE_CURSOR_LEFT:
      process.stdout.write("\033[" + step + "D");
      break;
  }
}

function hideCursor() {
  process.stderr.write("\x1B[?25l");
}

function showCursor() {
  process.stderr.write("\x1B[?25h");
}

module.exports = {
  moveCursor,
  hideCursor,
  showCursor,
  MOVE_CURSOR_UP,
  MOVE_CURSOR_DOWN,
  MOVE_CURSOR_RIGHT,
  MOVE_CURSOR_LEFT,
};
