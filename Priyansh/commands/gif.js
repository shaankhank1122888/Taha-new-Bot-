const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "gif",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Shaan",
  description: "Search random GIF from Google",
  commandCategory: "media",
  usages: "[search text]",
  cooldowns: 5
};

// 🔑 API KEY
const PRIYANSHU_API_KEY = "apim_yGi1yB9dUQQzofX3nWjvQf20u0L_IsN4NAOFEi-A760";

module.exports.run = async function ({ api, event, args }) {
  try {
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage(
        "⚠️ | Please enter search text.",
        event.threadID,
        event.messageID
      );
    }

    api.sendMessage(
      "🔍 | Searching Google GIF...",
      event.threadID,
      event.messageID
    );

    // Google GIF Search API
    const apiUrl = `https://priyanshuapi.xyz/api/search/google-gif?query=${encodeURIComponent(query)}&apikey=${PRIYANSHU_API_KEY}`;

    const res = await axios.get(apiUrl);

    if (!res.data || !res.data.result || res.data.result.length === 0) {
      return api.sendMessage(
        "❌ | No GIF found.",
        event.threadID,
        event.messageID
      );
    }

    // Random GIF
    const randomGif =
      res.data.result[
        Math.floor(Math.random() * res.data.result.length)
      ];

    const gifUrl =
      randomGif.url ||
      randomGif.gif ||
      randomGif.image;

    if (!gifUrl) {
      return api.sendMessage(
        "❌ | GIF URL not found.",
        event.threadID,
        event.messageID
      );
    }

    const path = __dirname + `/cache/${Date.now()}.gif`;

    // Download GIF
    const gif = await axios.get(gifUrl, {
      responseType: "arraybuffer"
    });

    fs.writeFileSync(path, Buffer.from(gif.data));

    // Send GIF
    api.sendMessage(
      {
        body:
`✨❁ ━━ ━[ 𝐆𝐎𝐎𝐆𝐋𝐄 𝐆𝐈𝐅 ]━ ━━ ❁✨

🔎 Search: ${query}
✅ Random GIF Sent`,
        attachment: fs.createReadStream(path)
      },
      event.threadID,
      () => fs.unlinkSync(path),
      event.messageID
    );

  } catch (e) {
    console.log(e);

    api.sendMessage(
      "❌ | Error fetching GIF.",
      event.threadID,
      event.messageID
    );
  }
};
