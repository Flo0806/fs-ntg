const { exec } = require("child_process");
const colors = require("colors");

async function checkIfNPMIsInstalled() {
  return new Promise((resolve, reject) => {
    exec("npm -v", (err, stdout, stderr) => {
      if (err || stderr)
        reject("Error on checking npm: ".bold.red + stderr.red);
      resolve(stdout);
    });
  });
}

module.exports.checkIfNPMIsInstalled = checkIfNPMIsInstalled;
