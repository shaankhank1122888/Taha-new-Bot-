const axios = require('axios');

module.exports.config = {
  name: 'xsearch',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'TAHA KHAN',
  description: 'Xalman API ke zariye online videos search karta hai',
  commandCategory: 'media',
  usages: '[query]',
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query) {
    return api.sendMessage(
      "⚠️ **Video search karne ke liye koi keyword likhein!**\n\n" +
      "📌 **Example:** `.vsearch funny cat compilation`",
      threadID,
      messageID
    );
  }

  api.sendMessage(`🔍 **Video Search:** "${query}" search ho raha hai...`, threadID, messageID);

  try {
    const apiUrl = `https://xalman-apis.vercel.app/api/x-videosearch?q=${encodeURIComponent(query)}`;
    const res = await axios.get(apiUrl);

    const data = res.data.result || res.data.data || res.data;

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return api.sendMessage("❌ Koi video search result nahi mila!", threadID, messageID);
    }

    const videoList = Array.isArray(data) ? data.slice(0, 5) : [data];
    let msg = `──── •🎬 VIDEO SEARCH RESULTS 🎬• ────\n\n📌 **Query:** ${query}\n\n`;

    videoList.forEach((item, index) => {
      const title = item.title || item.name || 'Video Title';
      const duration = item.duration || item.timestamp || item.time || 'N/A';
      const url = item.url || item.link || item.video || 'N/A';

      msg += `[ ${index + 1} ] **${title}**\n⏱️ Duration: ${duration}\n🔗 Link: ${url}\n\n`;
    });

    msg += `──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage(msg, threadID, messageID);

  } catch (err) {
    console.error('[ VSEARCH ERROR ]:', err);
    return api.sendMessage("❌ Video search karne mein issue aaya hai, server busy ho sakta hai!", threadID, messageID);
  }
};
