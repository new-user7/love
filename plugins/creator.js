const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "creator",
    alias: ["creator", "coder", "dev"],
    desc: "Show bot creator information",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Owner information (you can modify these values)
        const ownerInfo = {
            name: "𝐐𝐀𝐃𝐄𝐄𝐑_𝐊𝐇𝐀𝐍",
            number: "+923151105391",
            photo: "https://qu.ax/Pusls.jpg",
            bio: "The creator of this amazing bot"
        };

        // Beautiful formatted message
        const creatorMessage = `
╭───「 👑 *CREATOR INFO* 👑 」───
│
│ *🪪 Name:* ${ownerInfo.name}
│ *📞 Number:* ${ownerInfo.number}
│ *📝 Bio:* ${ownerInfo.bio}
│
│ *🤖 Bot Name:* ${config.BOT_NAME}
│ *⚡ Version:* ${config.VERSION || "4.0.0"}
│
╰─────────────────────

💡 *Contact for bot queries or support*`;

        // Send message with owner photo
        await conn.sendMessage(from, {
            image: { url: ownerInfo.photo },
            caption: creatorMessage,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Creator Command Error:", e);
        // Fallback text if image fails
        await reply(`👑 *Creator Info*\n\nName: 𝐐𝐀𝐃𝐄𝐄𝐑_𝐊𝐇𝐀𝐍\nNumber: +923151105391\n\nContact for bot support!`);
    }
});

