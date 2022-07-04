const readline = require("readline");
const ytdl = require("ytdl-core");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegPath);

async function generate(url, callback) {
  let id = ytdl.getURLVideoID(url);
  let stream = ytdl(id, {
    quality: "highestaudio",
  });

  let start = Date.now();
  ffmpeg(stream)
    .audioBitrate(128)
    .save(`${__dirname}/${id}.mp3`)
    .on("progress", (p) => {
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(`${p.targetSize}kb downloaded`);
    })
    .on("end", async () => {
      await callback(id);
      fs.unlinkSync(`${__dirname}/${id}.mp3`);
      console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
    });
}

module.exports = generate;
