const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

cmd({
  pattern: "repeat",
  alias: ["rp", "rpm"],
  desc: "Repeat a message a specified number of times.",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    if (!args[0]) {
      return reply("✳️ Use this command like:\n*Example:* .repeat 10,I love you");
    }

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (isNaN(count) || count <= 0 || count > 5000) {
      return reply("❎ Please specify a valid number between 1 and 5000.");
    }

    if (!message) {
      return reply("❎ Please provide a message to repeat.");
    }

    const repeatedMessage = Array(count).fill(message).join("\n");

    reply(`🔄 Repeated ${count} times:\n\n${repeatedMessage}`);
  } catch (error) {
    console.error("❌ Error in repeat command:", error);
    reply("❎ An error occurred while processing your request.");
  }
});
