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
  [span_0](start_span)const config = require('./config') //[span_0](end_span)
  const GroupEvents = require('./lib/groupevents');
  const qrcode = require('qrcode-terminal')
  const StickersTypes = require('wa-sticker-formatter')
  const util = require('util')
  const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
  const FileType = require('file-type');
  const axios = require('axios')
  // const { File } = require('megajs') // Not needed for Base64
  const { fromBuffer } = require('file-type')
  const bodyparser = require('body-parser')
  const os = require('os')
  const Crypto = require('crypto')
  const path = require('path')
  const prefix = config.PREFIX || '.'; [span_1](start_span)// Default prefix if not set[span_1](end_span)
  
  [span_2](start_span)// Ensure ownerNumber is always an array[span_2](end_span)
  const ownerNumber = config.OWNER_NUMBER ? config.OWNER_NUMBER.split(',').map(num => num.trim().replace(/[^0-9]/g, '')) : ['923151105391']; 
  const ownerJid = ownerNumber[0] ? ownerNumber[0] + '@s.whatsapp.net' : null; // Primary owner JID for error reporting
  
  const tempDir = path.join(os.tmpdir(), 'qadeer-ai-temp') // Unique temp dir name
  if (!fs.existsSync(tempDir)) {
      try { fs.mkdirSync(tempDir) } catch(e){ console.error("[ERROR] Failed to create temp directory:", e)}
  }
  
  const clearTempDir = () => {
      try {
          if (!fs.existsSync(tempDir)) return; // Skip if dir doesn't exist
          fs.readdir(tempDir, (err, files) => {
              if (err) { console.error("[ERROR] Failed to read temp directory:", err); return; }
              for (const file of files) {
                  try {
                      fs.unlink(path.join(tempDir, file), err => {
                          // Optional: Log unlink errors if needed, but can be noisy
                          // if (err && err.code !== 'ENOENT') console.error(`[ERROR] Failed to delete temp file ${file}:`, err);
                      });
                  } catch(e) { console.error(`[ERROR] Exception during temp file deletion ${file}:`, e); }
              }
          });
      } catch(e) { console.error("[ERROR] Exception in clearTempDir:", e); }
  }
  
  // Clear the temp directory every 5 minutes
  setInterval(clearTempDir, 5 * 60 * 1000);

const express = require("express");
const app = express();

//=================== ERROR REPORTING FUNCTION ====================
async function reportErrorToOwner(conn, error, context = "Unknown Context") {
    if (conn && conn.sendMessage && ownerJid) { // Check if conn and ownerJid are valid
        try {
            let errorMessage = `*[‼️ ${config.BOT_NAME || 'QADEER-AI'} ERROR REPORT ‼️]*\n\n`;
            errorMessage += `*Context:* ${context}\n`;
            errorMessage += `*Error:* ${error.message || String(error)}\n\n`; // Handle non-Error objects
            // Include a small part of the stack trace
            errorMessage += `*Stack (Partial):*\n${error.stack ? error.stack.split('\n').slice(0, 5).join('\n') : 'No stack trace'}\n\n`;
            errorMessage += `*Timestamp:* ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}`;

            await conn.sendMessage(ownerJid, { text: errorMessage });
            console.log(`[✅] Error report sent to owner: ${ownerJid}`);
        } catch (sendError) {
            console.error(`[❌] CRITICAL: Failed to send error report to owner!`, sendError);
            console.error(`[ℹ️] Original Error was:`, error);
        }
    } else {
        console.error(`[❌] Error occurred but couldn't send to owner (conn missing or OWNER_NUMBER unset?). Context: ${context}`);
        console.error(error);
    }
}
//====================================================================
  
//===================SESSION-AUTH (BASE64 with Prefix)============================
const sessionDir = path.join(__dirname, 'sessions');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    try { fs.mkdirSync(sessionDir, { recursive: true }) } catch(e){ console.error("[ERROR] Failed to create sessions directory:", e)}
}

async function loadSessionFromBase64() {
    try {
        if (config.SESSION_ID && config.SESSION_ID.trim() !== '') {
            console.log('[🔑] SESSION_ID found, attempting to load...');
            let sessionData = config.SESSION_ID.trim(); // Trim whitespace
            if (sessionData.startsWith('Qadeer~')) {
                console.log('[ℹ️] Qadeer~ prefix found, removing...');
                sessionData = sessionData.replace('Qadeer~', '');
            }
            // Basic check if it looks like Base64
            if (!/^[a-zA-Z0-9+/]*={0,2}$/.test(sessionData)) {
                 console.error('❌ SESSION_ID does not appear to be valid Base64!');
                 return false;
            }
            const decodedData = Buffer.from(sessionData, 'base64').toString('utf-8');
            // Basic check if decoded data is JSON
            try { JSON.parse(decodedData); } catch { console.error('❌ Decoded SESSION_ID is not valid JSON!'); return false; }

            fs.writeFileSync(credsPath, decodedData);
            console.log('[✅] Session file created successfully from SESSION_ID.');
            return true;
        }
    } catch (error) {
        console.error('❌ Error loading/decoding SESSION_ID:', error);
    }
    console.log('[🤳] SESSION_ID not found or invalid, QR code will be generated.');
    return false;
}

//===================PLUGIN LOADER (with Error Handling)============================
function loadPlugins() {
    console.log('🧬 Loading Plugins...');
    const pluginDir = path.join(__dirname, 'plugins');
    if (!fs.existsSync(pluginDir)) { console.log('⚠️ Plugins directory not found.'); return; }

    let loadedCount = 0, errorCount = 0;
    try {
        const pluginFiles = fs.readdirSync(pluginDir);
        pluginFiles.forEach((pluginFile) => {
            if (path.extname(pluginFile).toLowerCase() === ".js") {
                const pluginPath = path.join(pluginDir, pluginFile);
                try {
                    require(pluginPath);
                    // console.log(`[✅] Plugin loaded: ${pluginFile}`); // Optional: Uncomment if needed
                    loadedCount++;
                } catch (e) {
                    console.error(`[❌] ERROR loading plugin: ${pluginFile}`);
                    console.error(`[ℹ️] Details:`, e);
                    errorCount++;
                    // No need to report these errors to owner during startup usually
                }
            }
        });
    } catch (e) { console.error("[❌] CRITICAL ERROR reading plugins directory:", e); errorCount = -1; }

    console.log('-------------------------------------');
    if (errorCount === -1) console.log(`[❌] Failed to read plugins directory.`);
    else if (errorCount > 0) console.log(`[⚠️] Plugins loaded: ${loadedCount} success, ${errorCount} failed.`);
    else if (loadedCount === 0) console.log(`[ℹ️] No plugins found or loaded.`);
    else console.log(`[✅] All ${loadedCount} plugins loaded successfully.`);
    console.log('-------------------------------------');
}

  
async function connectToWA() {
  let conn = null; // Define conn here so it's accessible in reportErrorToOwner calls
  try { // Wrap the whole connection attempt
      console.log("Connecting to WhatsApp ⏳️...");
      const sessionExists = await loadSessionFromBase64();
      const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
      const { version } = await fetchLatestBaileysVersion();
      console.log(`[ℹ️] Using Baileys version: ${version.join('.')}`);

      conn = makeWASocket({ // Assign to the outer scope conn
          logger: P({ level: 'silent' }),
          printQRInTerminal: !sessionExists,
          browser: Browsers.macOS("Firefox"),
          syncFullHistory: false, // Recommended for stability
          auth: state,
          version,
          getMessage: async key => { return { conversation: 'implement_if_needed' } }
      });

      // ---- Connection Update Handler ----
      conn.ev.on('connection.update', async (update) => { // Added async here
          const { connection, lastDisconnect, qr } = update;
          if (connection === 'close') {
              const statusCode = (lastDisconnect.error)?.output?.statusCode;
              const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
              console.log(`Connection closed: ${DisconnectReason[statusCode] || 'Unknown'} (${statusCode}), Reconnecting: ${shouldReconnect}`);
              if (shouldReconnect) {
                  setTimeout(connectToWA, 5000);
              } else {
                  console.log('[🤖] Logged Out. Delete session and restart.');
                  // Optional: Automatically delete session
                  // try { if (fs.existsSync(sessionDir)) fs.rmSync(sessionDir, { recursive: true, force: true }); } catch(e){ console.error("Failed to delete session dir:", e); }
              }
          } else if (connection === 'open') {
              console.log('Bot connected to whatsapp ✅');
              console.log(`[ℹ️] User ID: ${conn.user?.id || 'Unknown'}`); // Added null check
              let up = `*Hello ${config.BOT_NAME || 'QADEER-AI'} User! 👋🏻*\n\n> Simple, Fast & Feature Rich Bot.\n\n*Thanks for using ${config.BOT_NAME || 'QADEER-AI'} 🚩*\n\n> Channel: https://whatsapp.com/channel/0029VajWxSZ96H4SyQLurV1H\n\n- *PREFIX:* ${prefix}\n\n> Star Repo: https://github.com/Qadeer-Xtech/QADEER-AI\n\n${config.DESCRIPTION || '© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽'} 🖤`;
              try {
                  if (conn.user?.id) { // Send only if ID is known
                     await conn.sendMessage(conn.user.id, { image: { url: config.MENU_IMAGE_URL || `https://files.catbox.moe/3tihge.jpg` }, caption: up });
                  }
              } catch (e) { console.error("[ERROR] Failed startup msg:", e); await reportErrorToOwner(conn, e, "Sending Startup Message"); }
          }
          if (qr && !sessionExists) { console.log('[🤖] Scan QR code to connect.'); }
      });

      // ---- Credentials Update Handler ----
      conn.ev.on('creds.update', saveCreds);

      // ---- Message Upsert Handler (Main Logic) ----
      conn.ev.on('messages.upsert', async (upsert) => {
          try {
              const mek = upsert.messages[0];
              if (!mek.message || upsert.type !== 'notify' || mek.key.remoteJid === 'status@broadcast') return;

              mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
              if (!mek.message) return;
              if (mek.message.viewOnceMessageV2) mek.message = mek.message.viewOnceMessageV2.message;

              // Read Message
              if (config.READ_MESSAGE === 'true' && !mek.key.fromMe) {
                  try { await conn.readMessages([mek.key]) } catch (e) { console.error("[ERROR] Read msg:", e); await reportErrorToOwner(conn, e, "Message Reading"); }
              }

              // --- Parse message context ---
              const m = sms(conn, mek);
              const type = getContentType(mek.message);
              const from = mek.key.remoteJid;
              const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo?.quotedMessage ? mek.message.extendedTextMessage.contextInfo.quotedMessage : {};
              const body = (type === 'conversation') ? mek.message.conversation :
                           (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
                           (type == 'imageMessage') && mek.message.imageMessage?.caption ? mek.message.imageMessage.caption :
                           (type == 'videoMessage') && mek.message.videoMessage?.caption ? mek.message.videoMessage.caption :
                           (type === 'buttonsResponseMessage') && mek.message.buttonsResponseMessage?.selectedButtonId ? mek.message.buttonsResponseMessage.selectedButtonId :
                           (type === 'listResponseMessage') && mek.message.listResponseMessage?.singleSelectReply?.selectedRowId ? mek.message.listResponseMessage.singleSelectReply.selectedRowId : '';

              console.log(`[DEBUG] Body: "${body}" | Type: ${type} | From: ${from} | Sender: ${mek.key.participant || from}`);

              const isCmd = body && typeof body === 'string' && body.startsWith(prefix);
              const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
              const args = isCmd ? body.trim().split(/ +/).slice(1) : [];
              const q = args.join(' ');
              const text = q; // Alias for args joined
              const isGroup = from.endsWith('@g.us');
              const sender = mek.key.fromMe ? (conn.user?.id?.split(':')[0]+'@s.whatsapp.net' || conn.user?.id) : (mek.key.participant || from);
              const senderNumber = sender ? sender.split('@')[0].replace(/[^0-9]/g, '') : null; // Clean number
              const botNumber = conn.user?.id ? conn.user.id.split(':')[0] : null;
              const pushname = mek.pushName || 'User';
              const isMe = botNumber && senderNumber ? botNumber === senderNumber : false;
              const isOwner = senderNumber ? ownerNumber.includes(senderNumber) || isMe : false; // Check includes cleaned number
              const botNumber2 = conn.user?.id ? await jidNormalizedUser(conn.user.id) : null;
              const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => { console.error("[ERROR] Group meta:", e); await reportErrorToOwner(conn, e, "Group Metadata"); return null; }) : null;
              const groupName = groupMetadata?.subject;
              const participants = groupMetadata?.participants || [];
              const groupAdmins = isGroup ? getGroupAdmins(participants) : [];
              const isBotAdmins = groupMetadata && botNumber2 ? groupAdmins.includes(botNumber2) : false;
              const isAdmins = groupMetadata ? groupAdmins.includes(sender) : false;
              const isReact = mek.message.reactionMessage ? true : false;

              const reply = (teks) => {
                  try { conn.sendMessage(from, { text: teks }, { quoted: mek }) }
                  catch (e) { console.error("[ERROR] Reply fail:", e); reportErrorToOwner(conn, e, `Replying in ${from}`); }
              }

              const dev = config.DEV ? config.DEV.split(',').map(d => d.trim().replace(/[^0-9]/g, '')) : [];
              let isCreator = isOwner || (senderNumber ? dev.includes(senderNumber) : false); // Owner or Dev is Creator

              // Eval Commands (Protected with isCreator)
              const budy = typeof mek.text == 'string' ? mek.text : false;
              if (isCreator && budy && budy.startsWith('%')) { /* ... eval code ... */ return; }
              if (isCreator && budy && budy.startsWith('$')) { /* ... async eval code ... */ return; }


              console.log(`[DEBUG] isCmd: ${isCmd}, Cmd: "${command}", Prefix: "${prefix}", Owner: ${isOwner}, Admin: ${isAdmins}`);

              // Public reacts (keep simple try-catch)
              if (!isReact && config.AUTO_REACT === 'true') { try { /* ... react ... */ } catch (e) { /* console.error */ } }
              if (!isReact && config.CUSTOM_REACT === 'true') { try { /* ... custom react ... */ } catch (e) { /* console.error */ } }


              // WORKTYPE Logic Check (Strictly enforce based on config)
              const workMode = config.MODE?.toLowerCase() || 'public'; [span_3](start_span)//[span_3](end_span)
              if (!isOwner) { // Only apply restrictions if not owner
                  if (workMode === 'private') {
                      console.log(`[MODE] Blocked: Private mode.`); return;
                  }
                  if (workMode === 'inbox' && isGroup) {
                      console.log(`[MODE] Blocked: Inbox mode in group chat.`); return;
                  }
                  if (workMode === 'groups' && !isGroup) {
                      console.log(`[MODE] Blocked: Groups mode in DM.`); return;
                  }
              }
              console.log(`[MODE] Check passed: Mode is "${workMode}", Sender is ${isOwner ? 'Owner' : 'User'}, Location is ${isGroup ? 'Group' : 'DM'}`);


              // --- Command Execution Logic ---
              const events = require('./command'); // Load command registry

              // 1. Prefix Commands
              if (isCmd) {
                  const cmd = events.commands.find((c) => c.pattern === command || (c.alias && c.alias.includes(command)));
                  if (cmd) {
                      console.log(`[CMD] Found: "${command}"`);
                      if (cmd.react) { try { await conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }}) } catch (e) { console.error("[ERROR] Cmd react fail:", e); } }
                      try {
                          console.log(`[CMD] Executing: "${command}"`);
                          await cmd.function(conn, mek, m, {from, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
                          console.log(`[CMD] Finished: "${command}"`);
                      } catch (e) {
                          console.error(`[❌ CMD EXECUTION ERROR] Cmd: "${command}"`);
                          console.error(e);
                          const errorMsg = `⚠️ Error in '${command}':\n_${e.message}_`;
                          reply(errorMsg);
                          await reportErrorToOwner(conn, e, `Executing Command: ${command}`);
                      }
                  } else {
                      console.log(`[CMD] Not Found: "${command}"`);
                      // Optional: Add a "command not found" reply here if desired
                      // reply(`Command "${command}" not found. Use ${prefix}menu to see available commands.`);
                  }
              }

              // 2. Event-Based Commands ('on' triggers)
              for (const cmdOn of events.commands) { // Use for...of for cleaner async handling if needed later
                  try {
                      let shouldExecute = false;
                      const eventType = cmdOn.on;
                      if (!eventType) continue; // Skip if 'on' is not defined

                      if (eventType === "body" && body) { shouldExecute = true; }
                      else if (eventType === "text" && q) { shouldExecute = true; }
                      else if ((eventType === "image" || eventType === "photo") && type === "imageMessage") { shouldExecute = true; }
                      else if (eventType === "sticker" && type === "stickerMessage") { shouldExecute = true; }
                      // Add checks for video, audio etc. if your plugins use them

                      if (shouldExecute) {
                          const cmdName = cmdOn.pattern || 'event handler';
                          console.log(`[EVENT] Executing 'on ${eventType}' for: ${cmdName}`);
                          await cmdOn.function(conn, mek, m, {from, l, quoted, body, isCmd, command: cmdOn, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
                          console.log(`[EVENT] Finished 'on ${eventType}' for: ${cmdName}`);
                      }
                  } catch (e) {
                      const cmdName = cmdOn.pattern || 'event handler';
                      console.error(`[❌ EVENT EXECUTION ERROR] Cmd: "${cmdName}", Event: ${cmdOn.on}`);
                      console.error(e);
                      await reportErrorToOwner(conn, e, `Executing 'on ${cmdOn.on}' for: ${cmdName}`);
                  }
              } // End of event loop

          } catch (mainHandlerError) {
              console.error("[❌ FATAL ERROR IN messages.upsert HANDLER]");
              console.error(mainHandlerError);
              await reportErrorToOwner(conn, mainHandlerError, "Main messages.upsert Handler");
          }
      }); // End messages.upsert

      // ---- AntiDelete Handler ----
      conn.ev.on('messages.update', async (updates) => {
          try {
              for (const { key, update } of updates) {
                  [span_4](start_span)if (update?.messageStubType === proto.WebMessageInfo.MessageStubType.REVOKE && config.ANTI_DELETE === 'true') { //[span_4](end_span)
                      console.log(`[DELETE] Message deleted in ${key.remoteJid}`);
                      // You'll need a way to find the original message content here (e.g., from a store or cache)
                      // await AntiDelete(conn, { key, ... }); // Pass necessary info to AntiDelete
                  }
              }
          } catch (e) { console.error("[ERROR] AntiDelete:", e); await reportErrorToOwner(conn, e, "AntiDelete Handler"); }
      });

      // ---- Group Participants Update ----
      conn.ev.on("group-participants.update", async (update) => {
          try { await GroupEvents(conn, update); }
          catch (e) { console.error("[ERROR] GroupEvents:", e); await reportErrorToOwner(conn, e, "Group Participants Update"); }
      });

      // ---- Helper Functions ----
      conn.decodeJid = (jid) => { /* ... decodeJid code ... */ return jidNormalizedUser(jid); }; // Simplified
      // ... (Include other necessary helper functions like downloadMediaMessage, sendFileUrl, etc.) ...
      conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted });
      // ... (Include getName, etc.) ...

  } catch (connectionError) { // Catch errors during initial connection setup
      console.error("❌ CRITICAL: Failed to initialize WhatsApp connection:", connectionError);
      // Reporting might not work here if conn is null, relies on console
      await reportErrorToOwner(null, connectionError, "Initial Connection Setup");
      // Optional: Exit or retry after a delay
      // setTimeout(connectToWA, 15000); // Retry after 15 seconds
  }
} // End connectToWA

// --- SERVER SETUP (HEROKU COMPATIBLE) ---
const port = process.env.PORT || 9090;

app.get("/", (req, res) => {
  res.send(`${config.BOT_NAME || 'QADEER-AI'} SERVER IS RUNNING ✅`);
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
  loadPlugins();
  console.log('Waiting 4 seconds before connecting...');
  setTimeout(() => {
    connectToWA().catch(err => console.error("❌ Initial connection attempt failed:", err));
  }, 4000);
});
