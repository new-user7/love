// 𝐪𝐚𝐝𝐞𝐞𝐞𝐫

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const fallbackPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363345872435489@newsletter',
        newsletterName: '𝐐𝐀𝐃𝐄𝐄𝐑-𝐀𝐈',
        serverMessageId: 143,
    },
});

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id) || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const groupDesc = metadata.desc || 'No description available.';
        const memberCount = metadata.participants.length;

        let groupPP;
        try {
            groupPP = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            groupPP = fallbackPP;
        }

        for (const user of update.participants) {
            const username = user.split('@')[0];
            const time = new Date().toLocaleString();
            let userPP;

            try {
                userPP = await conn.profilePictureUrl(user, 'image');
            } catch {
                userPP = groupPP; // Use group photo if user has none
            }

            const sendMessage = async (caption, image = false, mentions = [user]) => {
                const msg = {
                    caption,
                    mentions,
                    contextInfo: getContextInfo({ sender: user }),
                };
                if (image) msg.image = { url: userPP };
                else msg.text = caption;
                await conn.sendMessage(update.id, msg);
            };

            if (update.action === 'add' && config.WELCOME === 'true') {
                const welcome = 
`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👋 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑 𝐉𝐎𝐈𝐍𝐄𝐃  🎉
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🧑‍💼 ᴜsᴇʀ: @${username}
┃ 📅 ᴊᴏɪɴᴇᴅ: ${time}
┃ 🧮 ᴍᴇᴍʙᴇʀs: ${memberCount}
┃ 🏷️ ɢʀᴏᴜᴘ: ${groupName}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 📌 Description:
┃ ${groupDesc}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

                await sendMessage(welcome, true);

            } else if (update.action === 'remove' && config.WELCOME === 'true') {
                const goodbye = 
`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👋 𝐌𝐄𝐌𝐁𝐄𝐑 𝐋𝐄𝐅𝐓  😢
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🧑‍💼 ᴜsᴇʀ: @${username}
┃ 📅 ʟᴇғᴛ ᴀᴛ: ${time}
┃ 🧮 ʀᴇᴍᴀɪɴɪɴɢ: ${memberCount}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

                await sendMessage(goodbye, true);

            } else if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author.split('@')[0];
                const promoteMsg = 
`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔺 𝐏𝐑𝐎𝐌𝐎𝐓𝐈𝐎𝐍  🎖️
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🧑‍💼 ᴘʀᴏᴍᴏᴛᴇᴅ: @${username}
┃ 👑 ʙʏ: @${promoter}
┃ 🕒 ᴛɪᴍᴇ: ${time}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

                await sendMessage(promoteMsg, false, [user, update.author]);

            } else if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author.split('@')[0];
                const demoteMsg = 
`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔻 𝐃𝐄𝐌𝐎𝐓𝐈𝐎𝐍  ⚠️
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🧑‍💼 ᴅᴇᴍᴏᴛᴇᴅ: @${username}
┃ 👎 ʙʏ: @${demoter}
┃ 🕒 ᴛɪᴍᴇ: ${time}
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

                await sendMessage(demoteMsg, false, [user, update.author]);
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
