const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'neon',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'TAHA KHAN',
  description: 'Givens text ka HD Neon Glow Logo/Image banata hai',
  commandCategory: 'image',
  usages: '[text]',
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const text = args.join(" ");

  if (!text) {
    return api.sendMessage("⚠️ Neon image banane ke liye koi text likhein!\n\nExample: .neon TAHA KHAN", threadID, messageID);
  }

  const cachePath = path.join(__dirname, `neon_${Date.now()}.png`);

  try {
    const neonApiUrl = `https://api.ephoto360.com/neon?text=${encodeURIComponent(text)}`;
    
    const response = await axios.get(neonApiUrl, {
      responseType: 'arraybuffer'
    }).catch(async () => {
      // Fallback API if primary is busy
      return await axios.get(`https://api.samirdev.me/ephoto/neonlight?text=${encodeURIComponent(text)}`, {
        responseType: 'arraybuffer'
      });
    });

    fs.writeFileSync(cachePath, Buffer.from(response.data, 'binary'));

    const msg = `──── •⚡ NEON GLOW ⚡• ────\n\n🎨 **Text:** ${text}\n✨ **Style:** Cyber Neon Light\n\n──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (err) {
    console.error('[ NEON ERROR ]:', err);
    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    return api.sendMessage("❌ Neon image generate karne mein koi issue aaya hai, dobara try karein!", threadID, messageID);
  }
};
