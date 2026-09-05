const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'hd',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'TAHA KHAN',
  description: 'Reply ki gayi photo ko 4K/8K Ultra HD mein enhance karta hai',
  commandCategory: 'image',
  usages: 'Photo par reply karke .hd likhein',
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, type, messageReply, attachments } = event;

  let photoUrl = "";

  // Check if command is used on reply or with attachment
  if (type === "message_reply" && messageReply.attachments && messageReply.attachments.length > 0) {
    if (messageReply.attachments[0].type === "photo") {
      photoUrl = messageReply.attachments[0].url;
    }
  } else if (attachments && attachments.length > 0 && attachments[0].type === "photo") {
    photoUrl = attachments[0].url;
  }

  if (!photoUrl) {
    return api.sendMessage("⚠️ Kisi photo par reply karke command chalaen taakay usay 8K Ultra HD banaya ja sakay!", threadID, messageID);
  }

  const cachePath = path.join(__dirname, `hd_${Date.now()}.png`);
  
  // Processing status notification
  api.sendMessage("⌛ Image ko 4K/8K Ultra HD mein enhance kiya ja raha hai, please wait...", threadID, messageID);

  try {
    let response;
    
    // Primary Upscaler API
    try {
      response = await axios.get(`https://api.vyturex.com/upscale?url=${encodeURIComponent(photoUrl)}`, {
        responseType: 'arraybuffer'
      });
    } catch (primaryErr) {
      // Backup Enhancement API
      response = await axios.get(`https://samirdev.me/api/remini?url=${encodeURIComponent(photoUrl)}`, {
        responseType: 'arraybuffer'
      });
    }

    fs.writeFileSync(cachePath, Buffer.from(response.data, 'binary'));

    const msg = `──── •✨ ULTRA HD 8K ✨• ────\n\n📸 **Status:** Successfully Enhanced\n🔍 **Quality:** 4K / 8K Ultra Resolution\n\n──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (err) {
    console.error('[ HD ERROR ]:', err);
    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    return api.sendMessage("❌ Image enhance karne mein issue aaya hai, photo ki quality ya URL dobara check karein!", threadID, messageID);
  }
};
