const fetch = require("node-fetch");
const fs = require("fs");

async function wait(path, callback) {
  await fetch("https://api.trace.moe/search", {
    method: "POST",
    body: fs.readFileSync(path),
    headers: { "Content-Type": "image/jpeg" },
  })
    .then((elm) => {
      return elm.json();
    })
    .then(async (elm) => {
      console.log(elm);
      await callback(elm.result[0]);
      fs.unlinkSync(path);
    });
}

module.exports = wait;
