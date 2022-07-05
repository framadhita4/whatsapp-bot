const fetch = require("node-fetch");

async function wait(media, callback) {
  await fetch("https://api.trace.moe/search", {
    method: "POST",
    body: media,
    headers: { "Content-Type": "image/jpeg" },
  })
    .then((elm) => {
      return elm.json();
    })
    .then((elm) => {
      console.log(elm);
      callback(elm.result[0]);
    });
}

module.exports = wait;
