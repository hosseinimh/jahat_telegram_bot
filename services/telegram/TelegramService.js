require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const messagesCollection = require("../db/collections/Message");
const reportsCollection = require("../db/collections/Report");
const groupsCollection = require("../db/collections/Group");
const {
  getMetisResponses,
  getTags,
  getTunerResponse,
} = require("../metis/MetisService");
const sha256 = require("js-sha256").sha256;
const utils = require("../../utils/utils");
const { getLocale } = require("../../utils/utils");

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});
const TELEGRAM_BOT_USERNAME = "TeamTuneBot";
const messages = getLocale().messages;
const buttons = getLocale().buttons;
let wiatForManagerResonse = false;

telegramBot.on("callback_query", async function onCallbackQuery(callbackQuery) {
  const data = JSON.parse(callbackQuery.data);
  const opts = {
    chat_id: callbackQuery.message.chat.id,
    message_id: callbackQuery.message.message_id,
  };

  if (data.command === "selectGroup") {
    onSelectGroupButton(callbackQuery.message, data.groupId);
  } else if (data.command === "read") {
    onReadButton(callbackQuery.message, data.groupId);
  } else if (data.command === "tune") {
    wiatForManagerResonse = true;
    await telegramBot.sendMessage(
      callbackQuery.message.chat.id,
      `گزارش TeamTune در مورد آخرین وضعیت ارتباطی تیمت رو خوندی؟ اگر نخوندی اول از طریق دکمه «Read Your Team» حال و احوال ارتباطی تیمت رو بخون ...

اگر خوندی حالا وقته تحلیله و اقدام🏃‍♂️🏃‍♀️... 

برای اینکه بهت کمک کنم به یک سری ایده برای Tune کردن تیمت برسی، قبلش لازمه یه مقدار از ذهنیت‌ها و دغدغه‌هات به من بگی. مثلا می‌تونی به این سئوال‌ها فکر کنی و کوتاه بنویسی:
🖌با خوندن گزارش، تحلیل خودت از وضعیت ارتباطی تیمت چیه؟ 
🖌چه چیزی نگرانت کرد؟ چه چیزی خوشحال یا امیدوارت کرد؟
🖌به نظر خودت مهم‌ترین مشکل ارتباطی که باید حلش کنی چیه؟
🖌فکر می‌کنی چه کار میشه انجام داد و به نظرت آماده‌ی صحبت با چه کسانی هستی؟
🖌به غیر از این سئوالا هر دغدغه دیگه‌ای که همین الان در مورد تیمت داری برام بنویس ...`
    );
  }
});

telegramBot.on("message", async (message) => {
  try {
    console.log(message);

    if (
      message.chat.type === "group" &&
      message.new_chat_member?.username === TELEGRAM_BOT_USERNAME
    ) {
      onBotAddedToGroup(message);

      return;
    }

    if (
      message.chat.type === "group" &&
      message.left_chat_member?.username === TELEGRAM_BOT_USERNAME
    ) {
      onBotRemovedFromGroup(message);

      return;
    }

    if (message.chat.type === "group") {
      onGroupChat(message);

      return;
    }

    if (message.text === "/start") {
      onStartButton(message);

      return;
    }

    //     if (!msg?.text) {
    //       return;
    //     }

    //     if (wiatForManagerResonse) {
    //       wiatForManagerResonse = false;

    //       telegramBot.sendMessage(msg.chat.id, `لطفا منتظر بمانید ...`);
    //       const report = await reportCollection.getFirstReport();
    //       const response = await getTunerResponse(
    //         msg.text,
    //         report?.austin,
    //         report?.searle,
    //         report?.sentiment,
    //         report?.expression,
    //         report?.distribution
    //       );

    //       if (response) {
    //         const opts = {
    //           reply_markup: {
    //             inline_keyboard: [
    //               [
    //                 {
    //                   text: "تماس با تسهیل‌گر",
    //                   callback_data: JSON.stringify({
    //                     command: "facilitator",
    //                   }),
    //                 },
    //               ],
    //             ],
    //           },
    //         };
    //         await telegramBot.sendMessage(msg.chat.id, response);
    //         await telegramBot.sendMessage(
    //           msg.chat.id,
    //           `با توجه به توضیحاتت یک سری پیشنهاد دارم که در پیام بالا می‌تونی ببینی.
    // وقشته که ‌ شروع کنی به انجام این اقدامات و اثرش رو در نحوه تعامل تیم و پیام‌هایی که بین افراد رد و بدل میشه ببینی. دوباره با تحلیل پیام‌های جدید و حال و احوال تیم، قدم‌های بعدی رو با هم بر می‌داریم.

    // 📍پیشنهاد می‌کنم برای اطمینان از کاری که می‌خواهی انجام بدی، نظر تسهیلگر TeamTune رو بگیری.
    // موفق باشی ...`,
    //           opts
    //         );
    //       }

    //       return;
    //     }

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
  } catch (e) {
    console.error(e);
  }
});

async function onBotAddedToGroup(message) {
  try {
    await groupsCollection.deleteGroups(message);
    await groupsCollection.addGroup(message);
  } catch {}
}

async function onBotRemovedFromGroup(message) {
  try {
    await groupsCollection.deleteGroups(message);
  } catch {}
}

async function onGroupChat(message) {
  try {
    await telegramBot.sendMessage(
      message.chat.id,
      messages.groupChatNotAvailable
    );
  } catch {}
}

async function onStartButton(message) {
  try {
    await telegramBot.sendMessage(message.chat.id, messages.start);

    let groups = await groupsCollection.getMemberGroups(message);

    if (!groups || groups?.length === 0) {
      await telegramBot.sendMessage(message.chat.id, messages.botNotAdded);

      return;
    }

    let btns = [];

    for (const group of groups) {
      btns.push({
        text: group.message.chat.title,
        callback_data: JSON.stringify({
          command: "selectGroup",
          groupId: group.message.chat.id,
        }),
      });
    }

    const opts = {
      reply_markup: {
        inline_keyboard: [btns],
      },
    };

    await telegramBot.sendMessage(message.chat.id, messages.selectGroup, opts);
  } catch (e) {
    console.error(e);
  }
}

async function onSelectGroupButton(message, groupId) {
  try {
    const group = await groupsCollection.findGroup({
      "message.chat.id": groupId,
    });

    if (!group) {
      await telegramBot.sendMessage(message.chat.id, messages.groupNotFound);

      return;
    }

    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: buttons.readYourTeam,
              callback_data: JSON.stringify({
                command: "read",
                groupId,
              }),
            },
            {
              text: buttons.tuneYourTeam,
              callback_data: JSON.stringify({
                command: "tune",
                groupId,
              }),
            },
          ],
        ],
      },
    };

    await telegramBot.sendMessage(
      message.chat.id,
      messages.selectReadOrTune.replace(":field", group.message.chat.title),
      opts
    );
  } catch {}
}

async function onReadButton(message, groupId) {
  try {
    const { begin, end } = utils.getYesterday();
    const report = await reportsCollection.findReport({
      "message.chat.id": groupId,
    });

    if (!group) {
      await telegramBot.sendMessage(message.chat.id, messages.groupNotFound);

      return;
    }

    await telegramBot.sendMessage(
      message.chat.id,
      messages.read.replace(
        ":field",
        `${process.env.DASHBOARD_URL}/${sha256(`${message.chat.id}`)}`
      )
    );
  } catch {}
}
