const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
  name: "add",
  version: "1.0.0",
  hasPermssion: 2, // Safe side ke liye Admin permission
  credits: "TAHA KHAN",
  description: "Reply kiye gaye code ya file ko auto commands folder mein save karta hai",
  commandCategory: "system",
  usages: "[reply to code/file] [filename.js (optional)]",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, type, messageReply } = event;

  if (type !== "message_reply") {
    return api.sendMessage(
      "⚠️ **Kisi code wale message ya file par reply karke `.add` likhein!**\n\n" +
      "📌 **Usage:** Code ka reply karein -> `.add` ya `.add customname.js`",
      threadID,
      messageID
    );
  }

  let codeContent = "";
  let fileName = args[0];

  // 1. Agar reply mein koi .js ya text file attached hai
  if (messageReply.attachments && messageReply.attachments.length > 0) {
    const fileAcc = messageReply.attachments[0];
    if (fileAcc.url) {
      try {
        const res = await axios.get(fileAcc.url, { responseType: 'text' });
        codeContent = res.data;
        if (!fileName && fileAcc.name) fileName = fileAcc.name;
      } catch (e) {
        return api.sendMessage("❌ Attached file download karne mein error aaya!", threadID, messageID);
      }
    }
  }

  // 2. Agar reply text message/code block hai
  if (!codeContent && messageReply.body) {
    codeContent = messageReply.body.replace(/```javascript|```js|```/g, "").trim();
  }

  if (!codeContent) {
    return api.sendMessage("❌ Replied message mein koi code ya file nahi mili!", threadID, messageID);
  }

  // Auto-detect file name from module.exports.config.name agar args mein name na ho
  if (!fileName) {
    const match = codeContent.match(/name\s*:\s*["']([^"']+)["']/);
    if (match && match[1]) {
      fileName = `${match[1]}.js`;
    } else {
      fileName = `cmd_${Date.now()}.js`;
    }
  }

  if (!fileName.endsWith('.js')) {
    fileName += '.js';
  }

  const savePath = path.join(__dirname, fileName);

  try {
    fs.writeFileSync(savePath, codeContent, 'utf-8');

    const msg = `──── •⚙️ COMMAND ADDED ⚙️• ────\n\n` +
      `✅ **File Successfully Installed!**\n` +
      `📁 **File Name:** \`${fileName}\`\n` +
      `📍 **Location:** \`commands/${fileName}\`\n\n` +
      `──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage(msg, threadID, messageID);

  } catch (err) {
    console.error('[ ADD CMD ERROR ]:', err);
    return api.sendMessage("❌ File commands folder mein write karne mein error aaya!", threadID, messageID);
  }
};
