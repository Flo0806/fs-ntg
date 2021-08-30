const path = require("path");
const fs = require("fs");
var existsSync = fs.existsSync || path.existsSync;

function parseArgs(args) {
  if (typeof args === "string") {
    args = args.split(" ");
  }

  const eat = (i, args) => {
    if (i <= args.length) {
      return args.splice(i + 1, 1).pop();
    }
  };

  args = args.slice(2);
  let script = null;
  let lookForArgs = true;
  var argOptions = { scriptPosition: null };

  var argOpt = argOption.bind(null, argOptions);

  for (var i = 0; i < args.length; i++) {
    if (lookForArgs) {
      // respect the standard way of saying: hereafter belongs to my script
      if (args[i] === "--") {
        args.splice(i, 1);
        argOptions.scriptPosition = i;
        // cycle back one argument, as we just ate this one up
        i--;

        // ignore all further arguments
        lookForArgs = false;

        // move to the next iteration
        continue;
      }

      if (argOpt(args[i], eat.bind(null, i, args)) !== false) {
        args.splice(i, 1);
        // cycle back one argument, as we just ate this one up
        i--;
      }
    }
  }

  argOptions.script = script;
  argOptions.args = args;

  return argOptions;
}

function argOption(options, arg, eatNext) {
  if (arg === "--help" || arg === "-h" || arg === "-?") {
    var help = eatNext();
    options.help = help ? help : true;
    console.log(options.help);
  } else if (arg === "--version" || arg === "-v") {
    options.version = true;
  } else if (arg === "--config" || arg === "-c") {
    options.config = true;
  } else {
    return false;
  }
}

module.exports.parseArgs = parseArgs;
