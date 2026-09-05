global.client = global.client || {};
global.client.timeStart = global.client.timeStart || Date.now();

module.exports.config = {
  name: "upt",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "TAHA KHAN",
  description: "Advanced Matrix Cyberpunk Terminal Dashboard",
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
  const owner = "TAHA KHAN";

  const message = `
╔═════════════════════════════╗
║  ░█░█░█▀█░▀█▀░▀█▀░█▄█░█▀▀   ║
║  ░█░█░█▀▀░░█░░░█░░█░█░█▀▀   ║
║  ░▀▀▀░▀░░░░▀░░░▀░░▀░▀░▀▀▀   ║
╚═════════════════════════════╝
 ───[ ☣️ █▓▒░ SYSTEM MATRIX ░▒▓█ ☣️ ]───

┌───[ ⚡ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗨𝗦 ]
├─► 🟢 RUNTIME   :: ${days}d ${hours}h ${minutes}m ${seconds}s
├─► 📟 STATUS    :: ONLINE [100%]
└─► 💻 RAM USED  :: ${ramUsage} MB

┌───[ 🕒 𝗧𝗘𝗠𝗣𝗢𝗥𝗔𝗟 𝗗𝗔𝗧𝗔 ]
├─► ⏰ TIME      :: ${time}
├─► 📅 DATE      :: ${date}
└─► 🗓️ DAY       :: ${day}

┌───[ ⚙️ 𝗖𝗢𝗥𝗘 𝗦𝗣𝗘𝗖𝗦 ]
├─► 📊 COMMANDS  :: ${commandsCount} Loaded
├─► 🛠️ NODE VER  :: ${process.version}
└─► 👑 ROOT USER :: ${owner}
═══════════════════════════════
[ 🔓 ACCESS GRANTED // DEV: TAHA KHAN ]`;

  api.sendMessage(message.trim(), event.threadID, event.messageID);
}
