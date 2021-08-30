const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const {
  addPercentToProgress,
  createProgressbar,
} = require("./create-progressbar");

function validateFolderName(name) {
  name = name.replace(/#|_|\\|\/|:|\?|\*|<|>|"|[|]|[ ]/g, "_");
  return name.toLowerCase();
}

function calulcateProgressSteps(settings) {
  let steps = 3; // 1: Create main folder; 2: Init npm; 3: Create subfolders and files...
  settings.choices.customChoices.forEach((choice) => {
    steps++; // For each npm package to install add 1...
  });
  return steps;
}

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (e, so, se) => {
      if (e || se) {
        reject(e + "\n" + se);
      }
      resolve(so);
    });
  });
}

async function install(settings) {
  return new Promise(async (resolve, rejects) => {
    let stepsToCompleteInPercent = 100 / calulcateProgressSteps(settings);
    await createProgressbar();

    const folderName = validateFolderName(settings.projectName);

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    process.chdir(folderName);

    await addPercentToProgress(stepsToCompleteInPercent, "main folder created"); // Step 1

    // Init npm
    try {
      await runCommand("npm init -y");
      await addPercentToProgress(stepsToCompleteInPercent, "npm initialized"); // Step 2
    } catch (err) {
      addPercentToProgress(1, "Error", true);
      rejects("Error in init npm");
    }

    // Create index.js
    let dir = path.join(__dirname, "..", "docs", "index.txt");
    let body = fs.readFileSync(dir, "utf8").replace("<%=port%>", settings.port);
    fs.appendFileSync("index.js", body, { encoding: "utf-8" });

    ["routes", "middleware", "helper"].forEach((folder) => {
      try {
        fs.mkdirSync(folder);
      } catch (err) {
        if (err.toString().indexOf("EEXIST")) {
          let error = err.toString().split(" ");
          error = error[error.length - 1];
          settings.errors.push({
            errorType: "EEXIST",
            text: "Folder already exists",
            detail: error,
          });
        }
      }
    });

    await addPercentToProgress(stepsToCompleteInPercent, "sub folder created"); // Step 3

    // Create app.js
    if (
      settings.choices &&
      settings.choices.showDefault &&
      settings.choices.customChoices[0]
    ) {
      // Express should be installed...
      dir = path.join(__dirname, "..", "docs", "app_we.txt");
      body = fs.readFileSync(dir, "utf8");
      fs.appendFileSync("app.js", body, { encoding: "utf-8" });
    } else {
      fs.appendFileSync("app.js", "", { encoding: "utf-8" });
    }

    if (
      settings.choices &&
      settings.choices.showDefault &&
      settings.choices.customChoices[1]
    ) {
      // Express should be installed...
      dir = path.join(__dirname, "..", "docs", "jwt_mw.txt");
      body = fs.readFileSync(dir, "utf8");

      fs.appendFileSync("middleware/check-auth.js", body, {
        encoding: "utf-8",
      });
    }

    if (calulcateProgressSteps(settings) === 3)
      await addPercentToProgress(1, "Done", true); // Choices count is 0

    for (let i = 0; i < settings.choices.customChoices.length; i++) {
      try {
        await runCommand(settings.choices.customChoices[i]);
        await addPercentToProgress(
          stepsToCompleteInPercent,
          "NPM package installed " +
            (
              (i + 1).toString() +
              " of " +
              settings.choices.customChoices.length
            ).grey
        ); // Step 4+...
      } catch (err) {
        settings.errors.push({
          errorType: "NPM",
          text: "Error installing",
          detail: settings.choices.customChoices[i],
        });
      }
    }

    if (calulcateProgressSteps(settings) > 3)
      await addPercentToProgress(1, "Done", true); // Choices count is 0

    resolve();
  });
}

module.exports.install = install;
