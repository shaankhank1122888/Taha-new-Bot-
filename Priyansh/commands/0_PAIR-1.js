const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: 'pair',
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'TAHA KHAN',
  description: 'Group ke member ke sath jodi banata hai aur dono ki profile pics + names dikhata hai',
  commandCategory: 'fun',
  usages: 'pair',
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, senderID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const participantIDs = threadInfo.participantIDs.filter(id => id !== senderID && id !== api.getCurrentUserID());

    if (participantIDs.length === 0) {
      return api.sendMessage("Group mein jodi banane ke liye koi doosra member mojood nahi hai!", threadID, messageID);
    }

    const randomID = participantIDs[Math.floor(Math.random() * participantIDs.length)];
    const percentage = Math.floor(Math.random() * 51) + 50;

    const userInfo = await api.getUserInfo([senderID, randomID]);
    const senderName = userInfo[senderID]?.name || "User";
    const pairName = userInfo[randomID]?.name || "Partner";

    const fbToken = "6628568379%7Cc15411275155509164691122a2754881";
    const img1Url = `https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=${fbToken}`;
    const img2Url = `https://graph.facebook.com/${randomID}/picture?height=720&width=720&access_token=${fbToken}`;

    const path1 = path.join(__dirname, `pair1_${senderID}.png`);
    const path2 = path.join(__dirname, `pair2_${randomID}.png`);

    const img1Res = await axios.get(img1Url, { responseType: 'arraybuffer' });
    fs.writeFileSync(path1, Buffer.from(img1Res.data, 'binary'));

    const img2Res = await axios.get(img2Url, { responseType: 'arraybuffer' });
    fs.writeFileSync(path2, Buffer.from(img2Res.data, 'binary'));

    const msg = `──── •❤️• PAIRING •❤️• ────\n\n👩‍❤️‍👨 **Jodi Ban Gayi!**\n\n👤 **${senderName}**  💓  👤 **${pairName}**\n\n📊 **Compatibility:** ${percentage}%\n\n✨ **Msg:** Rab ne bana di jodi! Dono hamesha sath raho. 🥳\n                 ──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★`;

    return api.sendMessage({
      body: msg,
      attachment: [fs.createReadStream(path1), fs.createReadStream(path2)],
      mentions: [
        { tag: senderName, id: senderID },
        { tag: pairName, id: randomID }
      ]
    }, threadID, () => {
      if (fs.existsSync(path1)) fs.unlinkSync(path1);
      if (fs.existsSync(path2)) fs.unlinkSync(path2);
    }, messageID);

  } catch (err) {
    console.error('[ PAIR ERROR ]:', err);
    return api.sendMessage("Profile picture fetch karne mein koi issue aaya hai, dobara try karein!", threadID, messageID);
  }
};
      
