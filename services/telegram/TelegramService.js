require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const messageCollection = require("../db/collections/Message");
const { getMetisResponses, getTags } = require("../metis/MetisService");

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

telegramBot.on("message", async (msg) => {
  try {
    if (msg.text.startsWith("/report")) {
      telegramBot.sendMessage(msg.chat.id, process.env.DASHBOARD_URL);

      return;
    }

    // const responses = await getMetisResponses(msg.text);
    // const tags = getTags(
    //   responses.austinResponse?.content,
    //   responses.searleResponse?.content,
    //   responses.sentimentResponse?.content,
    //   responses.expressionResponse?.content,
    //   responses.distributionResponse?.content
    // );
    // messageCollection.addMessage({
    //   ...msg,
    //   metis_response: responses,
    //   tags,
    // });
    // telegramBot.sendMessage(
    //   msg.chat.id,
    //   `آستین:
    // ${responses.austinResponse?.content}`
    // );
    // telegramBot.sendMessage(
    //   msg.chat.id,
    //   `سرل:
    // ${responses.searleResponse?.content}`
    // );
    // telegramBot.sendMessage(
    //   msg.chat.id,
    //   `احساسات:
    // ${responses.sentimentResponse?.content}`
    // );
    // telegramBot.sendMessage(
    //   msg.chat.id,
    //   `اکسپرشن:
    // ${responses.expressionResponse?.content}`
    // );
    // telegramBot.sendMessage(
    //   msg.chat.id,
    //   `توزیع:
    // ${responses.distributionResponse?.content}`
    // );
  } catch (e) {
    console.error(e);
  }
});
