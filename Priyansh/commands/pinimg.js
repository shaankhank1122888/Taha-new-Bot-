const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'pinimg',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'TAHA KHAN',
  description: 'Pinterest se high-quality images search karke bhejta hai',
  commandCategory: 'image',
  usages: '[query]',
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage(
      "⚠️ **Pinterest par search karne ke liye koi keyword likhein!**\n\n" +
      "📌 **Example:** `.pinimg anime aesthetic wallpaper`",
      threadID,
      messageID
    );
  }

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  api.sendMessage(`🔍 **Pinterest** se "${query}" search ho raha hai...`, threadID, messageID);

  try {
    const apiUrl = `https://xalman-apis.vercel.app/api/pinimg?search=${encodeURIComponent(query)}`;
    const res = await axios.get(apiUrl);

    const data = res.data.result || res.data.data || res.data;

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return api.sendMessage("❌ Pinterest par koi image nahi mili!", threadID, messageID);
    }

    const imagesToFetch = Array.isArray(data) ? data.slice(0, 5) : [data];
    const attachments = [];

    for (let i = 0; i < imagesToFetch.length; i++) {
      const imgUrl = typeof imagesToFetch[i] === 'string' ? imagesToFetch[i] : (imagesToFetch[i].url || imagesToFetch[i].image || imagesToFetch[i].link);
      if (!imgUrl) continue;

      const imgPath = path.join(cacheDir, `pin_${i}_${Date.now()}.png`);
      const imgBuf = await axios.get(imgUrl, { responseType: 'arraybuffer' });
      fs.writeFileSync(imgPath, Buffer.from(imgBuf.data, 'binary'));
      attachments.push(fs.createReadStream(imgPath));
    }

    if (attachments.length === 0) {
      return api.sendMessage("❌ Images download karne mein problem aayi!", threadID, messageID);
    }

    const msg = `──── •📌 PINTEREST SEARCH 📌• ────\n\n📌 **Query:** ${query}\n✨ **Images Found:** ${attachments.length}\n\n──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage({
      body: msg,
      attachment: attachments
    }, threadID, () => {
      attachments.forEach(stream => {
        if (fs.existsSync(stream.path)) fs.unlinkSync(stream.path);
      });
    }, messageID);

  } catch (err) {
    console.error('[ PINIMG ERROR ]:', err);
    return api.sendMessage("❌ Pinterest search karne mein issue aaya hai, server busy ho sakta hai!", threadID, messageID);
  }
};
