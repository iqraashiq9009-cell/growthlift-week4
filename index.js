console.log("Hello from Node.js!");

const os = require("os");
console.log(os.platform());

const fs = require("fs");
fs.writeFileSync("test.txt", "Hello GrowthLift!");