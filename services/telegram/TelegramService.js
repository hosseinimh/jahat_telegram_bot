require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const messageCollection = require("../db/collections/Message");
const {
  getAustinResponse,
  getSearleResponse,
} = require("../metis/MetisService");

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

telegramBot.on("message", async (msg) => {
  try {
    const austinResponse = await getAustinResponse(msg.text);
    const searleResponse = await getSearleResponse(msg.text);

    messageCollection.addMessage({
      ...msg,
      metis_austin_response: {
        austin_response: austinResponse.content,
        searle_response: searleResponse.content,
      },
    });
    telegramBot.sendMessage(
      msg.chat.id,
      `آستین: 
${austinResponse.content}`
    );
    telegramBot.sendMessage(
      msg.chat.id,
      `سرل: 
${searleResponse.content}`
    );
  } catch (e) {
    console.error(e);
  }
});
