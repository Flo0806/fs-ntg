const path = require("path");
const fs = require("fs");

function runArgCommands(settings) {
  // Setup standard settings
  settings.choices = {};
  settings.choices.showDefault = true;
  settings.errors = [];

  if (settings.help) {
    var dir = path.join(__dirname, "..", "docs", "help.txt");
    var body = fs.readFileSync(dir, "utf8");
    process.exit(0);
  } else if (settings.config) {
    if (fs.existsSync(path.join(__dirname, "..", "ntg.json"))) {
      fs.readFile(
        path.join(__dirname, "..", "ntg.json"),
        "utf8",
        function (err, data) {
          if (err) throw err;
          obj = JSON.parse(data);
          settings.choices.showDefault = obj.choices.showDefault;
          settings.choices.customChoices = obj.choices.customChoices;
        }
      );
    }
    settings.showDefault = true;
    settings.customChoices = [
      { name: "react-markdown ImageSize", npm: "fs-imagesize" },
    ];
  }
}

module.exports.runArgCommands = runArgCommands;
