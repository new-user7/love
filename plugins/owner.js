const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅", 
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, pushName }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER;
        const ownerName = config.OWNER_NAME;

        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` + 
                      'END:VCARD';

        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/3tihge.jpg' },
            caption: `*╭────────────────⭓*
*┃────〘𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈〙────*
*┃─────────────────⭓*
*┃      𝐖𝐄𝐋𝐂𝐎𝐌𝐄
*┃● 𝑪𝒓𝒆𝒂𝒕𝒐𝒓 : 𝐀𝐩𝐧𝐚 𝐐𝐚𝐝𝐞𝐞𝐫*
*┃● 𝑵𝒂𝒎𝒆 : 𝐐𝐚𝐝𝐞𝐞𝐫_𝐊𝐡𝐚𝐧*
*┃● 𝑵𝒖𝒎𝒃𝒆𝒓 : https://wa.me/message/3XUP6XZN34PAN1*
*┃● 𝑨𝒈𝒆 : 18*
*╰────────────────⭓᛭*`,
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`], 
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299692857279@newsletter',
                    newsletterName: '𝚀𝙰𝙳𝙴𝙴𝚁-𝙰𝙸',
                    serverMessageId: 143
                }            
            }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/k0em5t.mp3' },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`An error occurred: ${error.message}`);
    }
});
