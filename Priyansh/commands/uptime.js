global.client = global.client || {};
global.client.timeStart = global.client.timeStart || Date.now();

module.exports.config = {
  name: "upt",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "TAHA KHAN",
  description: "Mobile-Optimized Cyberpunk Uptime",
  commandCategory: "system",
  usages: "upt / .upt / !upt",
  cooldowns: 5
};

// NON-PREFIX
module.exports.handleEvent = async ({ api, event }) => {
  if (!event.body || typeof event.body !== "string") return;
  if (event.body.toLowerCase().trim() !== "upt") return;
  sendUptime(api, event);
};

// PREFIX
module.exports.run = async ({ api, event }) => {
  sendUptime(api, event);
};

// FUNCTION
function sendUptime(api, event) {
  const uptime = Date.now() - global.client.timeStart;

  const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((uptime / (1000 * 60) % 60));
  const seconds = Math.floor((uptime / 1000) % 60);

  const now = new Date();

  const time = now.toLocaleTimeString("en-IN", {
    hour12: true,
    timeZone: "Asia/Karachi"
  });

  const date = now.toLocaleDateString("en-IN", {
    timeZone: "Asia/Karachi"
  });

  const day = now.toLocaleDateString("en-IN", {
    weekday: "long",
    timeZone: "Asia/Karachi"
  });

  const commandsCount = global.client.commands
    ? global.client.commands.size
    : "N/A";

  const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

  const message = `
┏━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👑 𝗧 𝗔 𝗛 𝗔   𝗞 𝗛 𝗔 𝗡 👑 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━┛
 ──[ ☣️ SYSTEM OVERRIDE ☣️ ]──

┌──[ ⚡ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 ]
├─► 🟢 UPTIME : ${days}d ${hours}h ${minutes}m ${seconds}s
├─► ⚡ STATUS : ONLINE
└─► 📟 RAM    : ${ramUsage} MB

┌──[ 🕒 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ]
├─► ⏰ TIME   : ${time}
├─► 📅 DATE   : ${date}
└─► 🗓️ DAY    : ${day}

┌──[ ⚙️ 𝗖𝗢𝗥𝗘 𝗜𝗡𝗙𝗢 ]
├─► 📊 CMDS   : ${commandsCount} Loaded
└─► 🛠️ NODE   : ${process.version}

==========================
🔥 ❤️‍🔥 𝗠𝗔𝗗𝗘 𝗕𝗬 𝗧𝗔𝗛𝗔 𝗞𝗛𝗔𝗡 ❤️‍🔥 🔥
==========================`;

  api.sendMessage(message.trim(), event.threadID, event.messageID);
}
