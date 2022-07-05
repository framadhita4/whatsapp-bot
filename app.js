const { Client, LocalAuth, MessageMedia, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const generate = require("./yt2mp3");
const wait = require("./wait");
const fs = require("fs");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  },
});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr);
});

client.on("ready", async () => {
  console.log("Client is ready!");

  // generate("https://www.youtube.com/watch?v=S9euLrpIYz8", async (id) => {
  //   const media = MessageMedia.fromFilePath(`${__dirname}/${id}.mp3`);
  //   await client.sendMessage("6281212710128@c.us", media);
  // });

  // let button = new Buttons(
  //   "body",
  //   [{ body: "bt1" }, { body: "bt2" }, { body: "bt3" }],
  //   "title",
  //   "footer"
  // );
  // client.sendMessage("6281212710128@c.us", button);
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
    fs.writeFile(
      "./upload/" + media.filename,
      media.data,
      "base64",
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    // wait(media, async (elm) => {
    //   await msg.reply(`${elm.filename}
    //   Episode: ${elm.episode}
    //   ${Math.floor(elm.similarity / 0.01)}% similarity`);
    //   const video = await MessageMedia.fromUrl(elm.video);
    //   await msg.reply(video);
    // });
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
  if (msg.body === "!pengumuman") {
    const chat = await msg.getChat();
    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      const contact = await client.getContactById(participant.id._serialized);
      mentions.push(contact);
      text += `@${participant.id.user} `;
    }
    text += "\nbesok badminton di cimariuk, kumpul di sekolah jam 9";
    await msg.reply(text, msg.from, { mentions });
  }
});

client.initialize();
