const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'song',
  version: '2.0.0',
  hasPermssion: 0,
  credits: 'TAHA KHAN',
  description: 'YouTube se Top 10 songs search karke selection menu deta hai',
  commandCategory: 'media',
  usages: '[song name]',
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const keyword = args.join(" ");

  if (!keyword) {
    return api.sendMessage("⚠️ Kisi gaane ka naam ya artist likhein!\n\nExample: .song Pasoori", threadID, messageID);
  }

  api.sendMessage("🔎 YouTube par search kiya ja raha hai, please wait...", threadID, messageID);

  try {
    // YouTube Search API for Top 10 results
    const searchRes = await axios.get(`https://api.samirdev.me/youtube/search?query=${encodeURIComponent(keyword)}`);
    const results = searchRes.data.results || searchRes.data;

    if (!results || results.length === 0) {
      return api.sendMessage("❌ Koi song nahi mila, dobara try karein!", threadID, messageID);
    }

    const top10 = results.slice(0, 10);
    let msgList = `🎵 **TOP 10 SEARCH RESULTS** 🎵\n\n`;

    top10.forEach((item, index) => {
      msgList += `[ ${index + 1} ] ${item.title}\n⏱️ Duration: ${item.duration || 'N/A'}\n\n`;
    });

    msgList += `👉 **Download karne ke liye 1 se 10 tak ka number REPLY karein!**\n\n──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage(msgList, threadID, (err, info) => {
      if (err) return;
      
      // Saving state for handleReply
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: senderID,
        songs: top10
      });
    }, messageID);

  } catch (err) {
    console.error('[ SONG SEARCH ERROR ]:', err);
    return api.sendMessage("❌ Song search karne mein error aaya hai!", threadID, messageID);
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, body, senderID } = event;

  // Check if reply is from the same person who searched
  if (senderID !== handleReply.author) {
    return api.sendMessage("⚠️ Yeh menu aapke liye nahi hai, khud .song likh kar search karein!", threadID, messageID);
  }

  const choice = parseInt(body.trim());

  if (isNaN(choice) || choice < 1 || choice > handleReply.songs.length) {
    return api.sendMessage(`⚠️ 1 se ${handleReply.songs.length} ke darmiyan number reply karein!`, threadID, messageID);
  }

  const selectedSong = handleReply.songs[choice - 1];
  const videoUrl = selectedSong.url || `https://www.youtube.com/watch?v=${selectedSong.id}`;

  api.unsendMessage(handleReply.messageID); // Purana list message remove
  api.sendMessage(`⏳ Option [ ${choice} ] "${selectedSong.title}" download ho raha hai...`, threadID, messageID);

  const cachePath = path.join(__dirname, `song_${Date.now()}.mp3`);

  try {
    // Download API
    const downloadRes = await axios.get(`https://api.vyturex.com/ytmp3?url=${encodeURIComponent(videoUrl)}`, {
      responseType: 'arraybuffer'
    }).catch(async () => {
      return await axios.get(`https://api.samirdev.me/youtube/mp3?url=${encodeURIComponent(videoUrl)}`, {
        responseType: 'arraybuffer'
      });
    });

    fs.writeFileSync(cachePath, Buffer.from(downloadRes.data, 'binary'));

    const msg = `🎧 **Playing:** ${selectedSong.title}\n\n──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(cachePath)
    }, threadID, () => {
      if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    }, messageID);

  } catch (err) {
    console.error('[ SONG DOWNLOAD ERROR ]:', err);
    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
    return api.sendMessage("❌ Song download karne mein issue aaya hai, dobara try karein!", threadID, messageID);
  }
};
