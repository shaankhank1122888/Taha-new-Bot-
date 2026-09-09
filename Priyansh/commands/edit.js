const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "editor",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TAHA KHAN",
  description: "AzadX API ke zariye images edit/process karta hai",
  commandCategory: "image",
  usages: "[reply to photo / image URL / prompt]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, type, messageReply } = event;
  let imageUrl = "";
  const textInput = args.join(" ");

  // Attachment / Reply se Image URL pick karna
  if (type === "message_reply" && messageReply.attachments && messageReply.attachments.length > 0) {
    if (messageReply.attachments[0].type === "photo") {
      imageUrl = messageReply.attachments[0].url;
    }
  } else if (event.attachments && event.attachments.length > 0 && event.attachments[0].type === "photo") {
    imageUrl = event.attachments[0].url;
  } else if (args[0] && args[0].startsWith("http")) {
    imageUrl = args[0];
  }

  if (!imageUrl && !textInput) {
    return api.sendMessage(
      "⚠️ **Kisi image par reply karke `.editor` likhein ya photo URL dein!**\n\n" +
      "📌 **Example:** Photo ka reply karein aur likhein `.editor`",
      threadID,
      messageID
    );
  }

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const cachePath = path.join(cacheDir, `editor_${Date.now()}.png`);
  api.sendMessage("🎨 **Image Editor** process ho raha hai, please wait...", threadID, messageID);

  try {
    let apiUrl = `https://azadx69x.is-a.dev/api/editor`;
    const params = [];

    if (imageUrl) params.push(`url=${encodeURIComponent(imageUrl)}`);
    if (textInput && !args[0].startsWith("http")) params.push(`text=${encodeURIComponent(textInput)}`);

    if (params.length > 0) {
      apiUrl += `?${params.join('&')}`;
    }

    let response = await axios.get(apiUrl, { responseType: 'arraybuffer' }).catch(async () => {
      // Fallback query parameter
      return await axios.get(`https://azadx69x.is-a.dev/api/editor?image=${encodeURIComponent(imageUrl)}`, { responseType: 'arraybuffer' });
    });

    // Check JSON error response
    try {
      const jsonData = JSON.parse(Buffer.from(response.data).toString('utf-8'));
      if (jsonData && (jsonData.error || jsonData.message)) {
        return api.sendMessage(`❌ API Error: ${jsonData.error || jsonData.message}`, threadID, messageID);
      }
    } catch (e) {
      // Binary image response received
    }

    fs.writeFileSync(cachePath, Buffer.from(response.data, 'binary'));

    const msg = `──── •🎨 IMAGE EDITOR 🎨• ────\n\n✨ **Image Successfully Edited!**\n\n──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (err) {
    console.error('[ EDITOR ERROR ]:', err);
    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    return api.sendMessage("❌ Image edit karne mein error aaya hai! API down ya busy ho sakti hai.", threadID, messageID);
  }
};
