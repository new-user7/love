const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

// Function to convert string "true"/"false" to boolean
function convertToBool(text, fault = 'true') {
    return text?.toLowerCase() === fault ? true : false; // Added lowercase and null check
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "",
    // Auto Status Features
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true", // Note: Duplicated key below, using this one
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY QADEER-AI 🇵🇰*",
    // Anti Features
    ANTI_DELETE: process.env.ANTI_DELETE || "false",
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",
    ANTI_LINK: process.env.ANTI_LINK || "true",
    ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
    ANTI_BAD: process.env.ANTI_BAD || "false",
    ANTI_VV: process.env.ANTI_VV || "true", // Anti View Once
    DELETE_LINKS: process.env.DELETE_LINKS || "false", // Delete links without kick
    // Group Management
    WELCOME: process.env.WELCOME || "false",
    ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
    // Bot Behavior
    MODE: process.env.MODE || "public", // public, private, inbox, groups
    PREFIX: process.env.PREFIX || ".",
    READ_MESSAGE: process.env.READ_MESSAGE || "false",
    READ_CMD: process.env.READ_CMD || "false",
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
    AUTO_TYPING: process.env.AUTO_TYPING || "false",
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false",
    // Auto Reactions
    AUTO_REACT: process.env.AUTO_REACT || "false", // React on all messages
    CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
    CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
    // Auto Features
    AUTO_STICKER: process.env.AUTO_STICKER || "false",
    AUTO_REPLY: process.env.AUTO_REPLY || "false", // Text reply
    MENTION_REPLY: process.env.MENTION_REPLY || "false", // Voice reply on mention
    // Bot Identity & Owner
    BOT_NAME: process.env.BOT_NAME || "QADEER-AI",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "923151105391",
    OWNER_NAME: process.env.OWNER_NAME || "Qadeer_Khan",
    DEV: process.env.DEV || "923151105391", // Developer/Additional Owner number(s), comma-separated
    // Appearance / Media
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/3tihge.jpg",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/3tihge.jpg", // Fixed missing quote
    LIVE_MSG: process.env.LIVE_MSG || "> I'm alive *QADEER-AI* 🇵🇰",
    DESCRIPTION: process.env.DESCRIPTION || "*©𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚀𝙰𝙳𝙴𝙴𝚁 𝙺𝙷𝙰𝙽*",
    STICKER_NAME: process.env.STICKER_NAME || "QADEER-AI",

    // Note: PUBLIC_MODE seems redundant if MODE is used. Sticking to MODE.
    // PUBLIC_MODE: process.env.PUBLIC_MODE || "true",

    // Note: AUTO_STATUS_REACT was defined twice. Keeping the first one.
};

// --- NO CODE AFTER THIS LINE ---
// The extra '}' was removed from here.
