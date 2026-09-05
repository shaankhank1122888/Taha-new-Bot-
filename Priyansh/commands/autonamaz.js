module.exports.config = {
  name: 'autonamaz',
  version: '15.0.0',
  hasPermssion: 0,
  credits: 'TAHA KHAN',
  description: 'Automatically Sends 5 Times Namaz Reminders with Quranic Verses',
  commandCategory: 'islamic messenger',
  usages: '[]',
  cooldowns: 3
};

const namazTimings = [
  {
    timer: '5:00:00 AM',
    message: ['──── •💜• ────\n               🕌 **فجر کی نماز کا وقت** 🕌\n\n📜 **عربی:**\nإِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا\n\n🇵🇰 **اردو ترجمہ:**\nبے شک نماز مومنوں پر مقررہ وقتوں میں فرض ہے۔ (النساء: 103)\n\n✨ **الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ**\n(نماز نیند سے بہتر ہے، اٹھیں اور باجماعت نماز ادا کریں)\n                 ──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★']
  },
  {
    timer: '1:30:00 PM',
    message: ['──── •💜• ────\n               🕌 **ظہر کی نماز کا وقت** 🕌\n\n📜 **عربی:**\nأَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ\n\n🇵🇰 **اردو ترجمہ:**\nنماز کو قائم کرو سورج ڈھلنے سے لے کر رات کی تاریکی تک۔ (الإسراء: 78)\n\n✨ **اپنا کاروبار و کام روک کر رب کے حضور پیش ہوں**\n                 ──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★']
  },
  {
    timer: '5:00:00 PM',
    message: ['──── •💜• ────\n               🕌 **عصر کی نماز کا وقت** 🕌\n\n📜 **عربی:**\nحَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ\n\n🇵🇰 **اردو ترجمہ:**\nسب نمازوں کی محافظت کرو بالخصوص بیچ والی نماز (عصر) کی۔ (البقرة: 238)\n\n✨ **عصر کی نماز چھوڑنے سے اعمال ضائع ہو جاتے ہیں، نماز قائم کریں**\n                 ──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★']
  },
  {
    timer: '7:00:00 PM',
    message: ['──── •💜• ────\n               🕌 **مغرب کی نماز کا وقت** 🕌\n\n📜 **عربی:**\nوَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ\n\n🇵🇰 **اردو ترجمہ:**\nاور صبر اور نماز کے ذریعے مدد چاہو۔ (البقرة: 45)\n\n✨ **مغرب کا وقت مختصر ہوتا ہے، جلدی سے وضو کر کے مسجد تشریف لے جائیں**\n                 ──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★']
  },
  {
    timer: '8:30:00 PM',
    message: ['──── •💜• ────\n               🕌 **عشاء کی نماز کا وقت** 🕌\n\n📜 **عربی:**\nوَأَقِمِ الصَّلَاةَ طَرَفَيِ النَّهَارِ وَزُلَفًا مِّنَ اللَّيْلِ\n\n🇵🇰 **اردو ترجمہ:**\nاور دن کے دونوں کناروں میں اور رات کے کچھ حصوں میں نماز قائم کرو۔ (ہود: 114)\n\n✨ **اپنے دن کا اختتام نماز عشاء اور اللہ کے ذکر کے ساتھ کریں**\n                 ──── •💜• ────»»𝐎𝐖𝐍𝐄𝐑««★𝐓𝐀𝐇𝐀 𝐊𝐇𝐀𝐍★']
  }
];

let lastSentPrayer = '';

module.exports.onLoad = function({ api }) {
  console.log('[ AUTONAMAZ ] :: 5 Times Prayer Reminder Service Active!');

  setInterval(async () => {
    try {
      const now = new Date();
      
      const timeFormatted = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Karachi',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\u202f/g, ' ').trim();

      const match = namazTimings.find(i => i.timer.toLowerCase() === timeFormatted.toLowerCase());

      if (match && lastSentPrayer !== match.timer) {
        lastSentPrayer = match.timer;
        const randomMsg = match.message[Math.floor(Math.random() * match.message.length)];

        let threadIDs = [];
        if (global.data && Array.isArray(global.data.allThreadID) && global.data.allThreadID.length > 0) {
          threadIDs = global.data.allThreadID;
        } else {
          const inbox = await api.getThreadList(100, null, ['INBOX']).catch(() => []);
          threadIDs = inbox.map(t => t.threadID);
        }

        for (const threadID of threadIDs) {
          api.sendMessage(randomMsg, threadID, () => {}).catch(() => {});
        }
      }
    } catch (err) {
      console.error('[ AUTONAMAZ ERROR ]:', err);
    }
  }, 1000);
};

module.exports.run = async function({ api, event }) {
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Karachi',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\u202f/g, ' ').trim();

  const match = namazTimings.find(i => i.timer.toLowerCase() === timeFormatted.toLowerCase()) || namazTimings[0];
  const randomMsg = match.message[Math.floor(Math.random() * match.message.length)];

  api.sendMessage(randomMsg, event.threadID, event.messageID);
};
