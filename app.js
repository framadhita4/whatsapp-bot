const { Client, LocalAuth, MessageMedia, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const generate = require("./yt2mp3");
const wait = require("./wait");
const fs = require("fs");

const client = new Client({
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr);
});

client.on("ready", async () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  if (msg.hasMedia && msg.type == "image" && msg.body == "!sticker") {
    const sticker = await msg.downloadMedia();
    msg.reply(sticker, msg.from, { sendMediaAsSticker: true });
  }
  if (msg.body.search("!download") != -1) {
    msg.reply("Downloading...");
    const vidUrl = msg.body.split(" ")[1];
    generate(vidUrl, async (id) => {
      const media = MessageMedia.fromFilePath(`${__dirname}/${id}.mp3`);
      await msg.reply(media);
    });
  }
  if (msg.hasMedia && msg.type == "image" && msg.body == "!animek") {
    const media = await msg.downloadMedia();
    fs.writeFileSync(`./upload/${media.filename}.jpg`, media.data, "base64");

    await wait(`./upload/${media.filename}.jpg`, async (elm) => {
      await msg.reply(
        `${elm.filename}\nEpisode: ${elm.episode}\n${Math.floor(
          elm.similarity / 0.01
        )}% similarity`
      );
      const video = await MessageMedia.fromUrl(elm.video);
      await msg.reply(video);
    });
  }
});

client.on("message", async (msg) => {
  if (msg.body === "!everyone") {
    const chat = await msg.getChat();
    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);
      mentions.push(contact);
      text += `@${participant.id.user} `;
    }
    await msg.reply(text, msg.from, { mentions });
  }
});

client.initialize();
