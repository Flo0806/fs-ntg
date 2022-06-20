const { checkIfNPMIsInstalled } = require("../helpers/check-npm-installed");
const { runArgCommands } = require("../helpers/run-args-commands");
const colors = require("colors");

const { createChoisePrompt } = require("../helpers/create-choice-prompt");
const { createInputPrompt } = require("../helpers/create-input-promt");
const { install } = require("../helpers/install_modules");

const pjson = require("../package.json");

function Log(text, color, bgColor = colors.bgBlack, styles = colors.reset) {
  console.log(text[color][bgColor][styles]);
}

function drawLogo() {
  console.log(
    "             ______       ___ ________________ ____________".red
  );
  console.log(
    "            /      \\    /   /                /             \\".red
  );
  console.log(
    "           /   __   \\  /   / _____     _____/      ________/".red
  );
  console.log(
    "          /   /  \\   \\/   /      /    /     /     / ______".red
  );
  console.log(
    "         /   /    \\      /      /    /     /     / |_     \\".red
  );
  console.log(
    "        /   /      |    /      /    /     /     |___/     /".red
  );
  console.log(
    "       /___/      /____/      /____/      \\______________/".red
  );
  console.log();
  console.log();
  console.log();
}

function ntg(settings) {
  drawLogo();
  runArgCommands(settings);

  Log(
    "-= NODE TEMPLATE GENERATOR v" + pjson.version + "=-",
    "red",
    "bgYellow",
    "bold"
  );
  console.log();
  //createProgressbar();
  //addPercentToProgress(15, "Te");
  //addPercentToProgress(15, "TE");

  let awnsers = [];
  checkIfNPMIsInstalled()
    .then((data) => {
      if (settings.choices.showDefault) {
        awnsers = [
          { name: "Express", npm: "npm install --save express" },
          { name: "JsonWebToken", npm: "npm install --save jsonwebtoken" },
          { name: "Multer", npm: "npm install --save multer" },
          { name: "bcrypt", npm: "npm install --save bcrypt" },
          { name: "Nodemailer", npm: "npm install --save nodemailer" },
        ];
      }
      if (
        settings.choices.customChoices &&
        Array.isArray(settings.choices.customChoices)
      ) {
        settings.choices.customChoices.forEach((customChoices) => {
          customChoices.npm = "npm install --save " + customChoices.npm;
          awnsers.push(customChoices);
        });
      }

      return createChoisePrompt(
        "What do you want to install?",
        awnsers.map((awnser) => {
          return awnser.name;
        })
      );
    })
    .then((data) => {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i]) {
          result.push(awnsers[i].npm);
        }
      }

      settings.choices.customChoices = result;
      return createInputPrompt("Projects name?");
    })
    .then((data) => {
      if (!data || data === "") {
        data = "New Project";
      }
      settings.projectName = data;
    })
    .then(() => {
      return createInputPrompt("On which port should the HTTP server run?");
    })
    .then((data) => {
      if (!data || isNaN(parseInt(data))) {
        settings.port = '"3300"';
      } else {
        settings.port = '"' + parseInt(data) + '"';
      }
      return install(settings);
    })
    .then(() => {
      // Show summary
      if (settings.errors.length === 0) {
        console.log(
          "The project was generated ".green + "successfully".bold.green
        );
      } else {
        console.log("One or more errors occurred".red);
        settings.errors.forEach((error) => {
          console.log(
            "  " +
              error.errorType.bold.red +
              "  " +
              error.text.red +
              " " +
              error.detail.red.bold
          );
        });
        console.log();
        console.log();
      }
    })
    .catch((error) => {
      console.log(error.red.bold);
      console.log();
      console.log();
    });
}

module.exports.ntg = ntg;
