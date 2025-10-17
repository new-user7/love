const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "poetry",
    alias: ["shayar", "shayari"],
    desc: "Get a random romantic shayari",
    react: "💖",
    category: "fun",
    use: '.poetry',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const apiUrl = 'https://shizoapi.onrender.com/api/texts/shayari?apikey=shizo';
        
        const { data } = await axios.get(apiUrl);
        
        if (!data.result) {
            return reply("❌ Try again plz...!");
        }
        
        const shayariMessage = `${data.result}`.trim();

        await reply(shayariMessage);
        
    } catch (error) {
        console.error('Shayari Error:', error);
        reply("❌ Try again plz...!");
    }
});
