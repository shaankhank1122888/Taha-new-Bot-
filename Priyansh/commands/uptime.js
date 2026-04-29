global.client = global.client || {};
global.client.timeStart = global.client.timeStart || Date.now();

module.exports.config = {
  name: "upt",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "TAHA KHAN",
  description: "Uptime | Prefix + Non-Prefix",
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
  const minutes = Math.floor((uptime / (1000 * 60)) % 60);
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

  const owner = "TAHA KHAN";

  const message = `
╭─────────────────────────────╮
│ 🎉 ✧ 𝗨𝗣𝗧𝗜𝗠𝗘 ✧ 😉 │
╰─────────────────────────────╯
✰ 𝗥𝗨𝗡 ➪ ${days}d ${hours}h ${minutes}m ${seconds}s ✅
✰ 𝗧𝗜𝗠𝗘 ➪ ${time} ⏰
✰ 𝗗𝗔𝗧𝗘 ➪ ${date} 📅
✰ 𝗗𝗔𝗬 ➪ ${day} 🗓️
✰ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 ➪ ${commandsCount} 📊
✰ 𝗢𝘄𝗻𝗲𝗿 ➪ ${owner} 👑
┗━━━━━━━━━━━━━━━━━━━━━━━┛
𝗠𝗔𝗗𝗘 𝗕𝗬 ❤️‍🔥 ❤️‍🔥 𝗧𝗔𝗛𝗔 𝗞𝗛𝗔𝗡
`;

  api.sendMessage(message, event.threadID, event.messageID);
}
