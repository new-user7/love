const config = require('../config')
const { cmd, commands } = require('../command');
const os = require("os")
const { runtime } = require('../lib/functions')
const axios = require('axios')

cmd({
    pattern: "menu",
    alias: ["allmenu", "fullmenu"],
    desc: "Show all bot commands",
    category: "main",
    react: "✅",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const verifiedReply = {
            key: {
                participant: `0@s.whatsapp.net`,
                fromMe: false,
                remoteJid: "status@broadcast"
            },
            message: {
                extendedTextMessage: {
                    text: "Qadeer-AI Official",
                    contextInfo: {
                        mentionedJid: [],
                        verifiedBizName: "Qadeer-AI"
                    }
                }
            }
        };

        let dec = `┏━〔 *${config.BOT_NAME}* 〕━┓

┋ *Owner* : *${config.OWNER_NAME}*
┋ *Library* : *DJ Baileys*
┋ *Hosting* : *Heroku*
┋ *Mode* : [ *${config.MODE}* ]
┋ *Prefix* : [ *${config.PREFIX}* ]
┋ *Version* : *2.0.0*
┗━━━━━━━━━━━━━━┛


╭❮🧠𝐀𝐈 𝐌𝐄𝐍𝐔🧠❯✦
┃»➤  chatgpt
┃»➤  sora
┃»➤  creat-img
╰─────────────✦


╭❮🟢𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐌𝐄𝐍𝐔🟢❯✦
┃»➤ channel-id
┃»➤ channel-info
╰─────────────✦


╭❮💠𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔💠❯✦
┃»➤  quran
┃»➤  quranmenu
┃»➤  owner
┃»➤  creator
┃»➤  ping
┃»➤  ping2
┃»➤  alive
┃»➤  menu
┃»➤  uptime
╰─────────────✦


╭❮👑𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔👑❯✦
┃»➤ update
┃»➤ restart
┃»➤ gjid
┃»➤ broadcast
┃»➤ shutdown
┃»➤ block
┃»➤ unblock
┃»➤ envlist
┃»➤ setreacts
┃»➤ setbotimage
┃»➤ setownername
┃»➤ setbotname
┃»➤ setprefix
╰─────────────✦
 
 
╭❮📥𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐌𝐄𝐍𝐔📥❯✦
┃»➤ mediafire
┃»➤ tiktok
┃»➤ apk
┃»➤ gitclone
┃»➤ rw
┃»➤ shortplay
┃»➤ play
┃»➤ song
┃»➤ video
┃»➤ video2
╰─────────────✦


╭❮🎭𝐅𝐔𝐍 𝐌𝐄𝐍𝐔🎭❯✦
┃»➤ flirt
┃»➤ character
┃»➤ repeat
┃»➤ hack
┃»➤ joke
┃»➤ poetry
┃»➤ me
╰─────────────✦


╭❮🌀𝐓𝐎𝐎𝐋𝐒 𝐌𝐄𝐍𝐔🌀❯✦
┃»➤ fullpp
┃»➤ calculate
┃»➤ emojimix
┃»➤ emoji
┃»➤ shorturl
┃»➤ tourl
┃»➤ vsticker
┃»➤ topdf
╰─────────────✦


╭❮🔎𝐒𝐄𝐀𝐑𝐂𝐇 𝐌𝐄𝐍𝐔🔎❯✦
┃»➤ define
┃»➤ sgithub
┃»➤ githubstalk
┃»➤ playstore
┃»➤ repo
┃»➤ srepo
╰─────────────✦


╭❮🤢𝐔𝐓𝐈𝐋𝐈𝐓𝐘 𝐌𝐄𝐍𝐔🤢❯✦
┃»➤ repo
┃»➤ jid
┃»➤ save
┃»➤ take
┃»➤ sticker
┃»➤ report
┃»➤ tempmail
┃»➤ checkmail
╰────────────๏


╭❮🕵𝐏𝐑𝐈𝐕𝐀𝐂𝐘 𝐌𝐄𝐍𝐔🕵❯✦
┃»➤ privacy
┃»➤ getpp
┃»➤ groupsprivacy
┃»➤ getprivacy
┃»➤ updatebio
┃»➤ setmyname
┃»➤ setpp
┃»➤ setonline
┃»➤ setppall
┃»➤ getbio
┃»➤ blocklist
╰─────────────✦


╭❮⚙𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 𝐌𝐄𝐍𝐔⚙❯✦
┃»➤ antidelete
┃»➤ customreact
┃»➤ ownerreact
┃»➤ mention-reply
┃»➤ autostatusreply
┃»➤ autoreact
┃»➤ autoreply
┃»➤ autosticker
┃»➤ antibad
┃»➤ read-message
┃»➤ autostatusview
┃»➤ autostatusreact
┃»➤ autorecoding
┃»➤ alwaysonline
┃»➤ autotyping
┃»➤ mode
┃»➤ goodbye
┃»➤ welcome
╰─────────────✦


╭❮💬𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔💬❯✦
┃»➤ tagadmins
┃»➤ requestlist
┃»➤ acceptall
┃»➤ rejectall
┃»➤ invite
┃»➤ g-admin
┃»➤ updategdesc
┃»➤ updategname
┃»➤ ginfo
┃»➤ join
┃»➤ kickall
┃»➤ unmute
┃»➤ leave
┃»➤ glink
┃»➤ lockgc
┃»➤ out
┃»➤ poll
┃»➤ kick
┃»➤ revoke
┃»➤ tag
┃»➤ tagall
┃»➤ unlockgc
┃»➤ broadcast
┃»➤ antilink
┃»➤ deletelink
╰─────────────✦


╭❮🎨𝐋𝐎𝐆𝐎 𝐌𝐄𝐍𝐔🎨❯✦
┃»➤ neonlight
┃»➤ blackpink
┃»➤ dragonball
┃»➤ 3dcomic
┃»➤ america
┃»➤ naruto
┃»➤ sadgirl
┃»➤ clouds
┃»➤ futuristic
┃»➤ 3dpaper
┃»➤ eraser
┃»➤ sunset
┃»➤ leaf
┃»➤ galaxy
┃»➤ sans
┃»➤ boom
┃»➤ hacker
┃»➤ devilwings
┃»➤ nigeria
┃»➤ bulb
┃»➤ angelwings
┃»➤ zodiac
┃»➤ luxury
┃»➤ paint
┃»➤ frozen
┃»➤ castle
┃»➤ tatoo
┃»➤ valorant
┃»➤ bear
┃»➤ typography
┃»➤ birthday
╰─────────────✦

> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙰𝙸 🤖* `;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/3tihge.jpg' },
            caption: dec,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299692857279@newsletter',
                    newsletterName: config.BOT_NAME,
                    serverMessageId: 143
                }
            }
        }, { quoted: verifiedReply });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});