const axios = require("axios");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

cmd({
  pattern: "joke",
  desc: "😂 Get a random joke",
  react: "🤣",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;

    if (!joke || !joke.setup || !joke.punchline) {
      return reply("❌ Failed to fetch a joke. Please try again.");
    }

    const jokeMessage = `🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸*`;

    return reply(jokeMessage);
  } catch (error) {
    console.error("❌ Error in joke command:", error);
    return reply("⚠️ An error occurred while fetching the joke. Please try again.");
  }
});
