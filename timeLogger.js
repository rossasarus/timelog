
const fs = require("fs");
const notifier = require("node-notifier");
const path = require("path");

let d = new Date();
let rawdata = fs.readFileSync(path.join(__dirname, "/timelog.json"));
let data = JSON.parse(rawdata);

function addTimestamp() {
  if (d.toLocaleDateString() in data) {
    data[d.toLocaleDateString()].timestamps.push(d.toLocaleTimeString());
  } else {
    data[d.toLocaleDateString()] = {
      minutes: 0,
      timestamps: [d.toLocaleTimeString()],
    };
  }
  return data;
}

function tallyHours() {
  if (d.toLocaleDateString() in data) {
    data[d.toLocaleDateString()].minutes =
      data[d.toLocaleDateString()].timestamps.length;
  }
  let hours =
    Math.round((data[d.toLocaleDateString()].minutes / 60) * 100) / 100;
    if (hours > 8) notify(`you did it! ${hours} hours completed.`, "go home!")
  return `timelogger -> ${hours} Hours / ${data[d.toLocaleDateString()].minutes} Minutes`;
}

function writeData() {
  let outJSON = JSON.stringify(data, null, 2);
  fs.writeFileSync(path.join(__dirname, "/timelog.json"), outJSON);
}

function notify(title, message) {
  notifier.notify({
    title: title,
    message: message,
  });
}

setInterval(() => {
  d = new Date();
  process.stdout.write("\033c");
  addTimestamp();
  console.log(tallyHours());
  writeData();
}, 60000);
