// read (or make) json file
// "use strict";
var d = new Date();

const fs = require("fs");

let rawdata = fs.readFileSync("./timelog.json");
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
  return `${hours} Hours / ${data[d.toLocaleDateString()].minutes} Minutes`;
}

function writeData() {
  let outJSON = JSON.stringify(data, null, 2);
  fs.writeFileSync("./timelog.json", outJSON);
}

setInterval(() => {
  process.stdout.write("\033c");
  addTimestamp();
  console.log(tallyHours());
  writeData();
}, 60000);
