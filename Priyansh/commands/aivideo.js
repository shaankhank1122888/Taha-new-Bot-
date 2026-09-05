const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'aivideo',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'TAHA KHAN',
  description: 'Text prompt se AI video generate karta hai',
  commandCategory: 'media',
  usages: '[prompt]',
  cooldowns: 30
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const prompt = args.join(" ");

  if (!prompt) {
    return api.sendMessage("⚠️ AI Video banane ke liye koi prompt likhein!\n\nExample: .aivideo A futuristic cyberpunk car driving in rain at night", threadID, messageID);
  }

  const cachePath = path.join(__dirname, `aivideo_${Date.now()}.mp4`);
  
  api.sendMessage("⌛ AI Video process ho rahi hai, please 1 se 2 minute wait karein...", threadID, messageID);

  try {
    let response;

    // Primary Text-to-Video API
    try {
      response = await axios.get(`https://api.vyturex.com/text2video?prompt=${encodeURIComponent(prompt)}`, {
        responseType: 'arraybuffer',
        timeout: 180000
      });
    } catch (primaryErr) {
      // Backup AI Video Generator API
      response = await axios.get(`https://samirdev.me/api/text2video?prompt=${encodeURIComponent(prompt)}`, {
        responseType: 'arraybuffer',
        timeout: 180000
      });
    }

    fs.writeFileSync(cachePath, Buffer.from(response.data, 'binary'));

    const msg = `──── •🎬 🎥AI VIDEO GENERATOR 🎬• ────\n\n📝 **Prompt:** ${prompt}\n✨ **Status:** Video Generated\n\n──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (err) {
    console.error('[ AIVIDEO ERROR ]:', err);
    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    return api.sendMessage("❌ AI Video generate karne mein issue aaya hai. Server busy hai, thodi der baad try karein!", threadID, messageID);
  }
};
