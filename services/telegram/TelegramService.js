require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const messagesCollection = require("../db/collections/Message");
const reportsCollection = require("../db/collections/Report");
const groupsCollection = require("../db/collections/Group");
const {
  getMetisResponses,
  getTags,
  getTunerResponse,
  analyseTags,
} = require("../metis/MetisService");
const utils = require("../../utils/utils");
const { getLocale } = require("../../utils/utils");

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});
const TELEGRAM_BOT_USERNAME = "TeamTuneBot";
const messages = getLocale().messages;
const buttons = getLocale().buttons;
let waitForManagerResponse = false;
let groupId = null;

telegramBot.on("callback_query", async function onCallbackQuery(callbackQuery) {
  const data = JSON.parse(callbackQuery.data);

  if (data.command === "selectGroup") {
    await onSelectGroupButton(callbackQuery.message, data.groupId);
  } else if (data.command === "read") {
    await onReadButton(callbackQuery.message, data.groupId);
  } else if (data.command === "tune") {
    groupId = data.groupId;
    await onTuneButton(callbackQuery.message, data.groupId);
  }
});

telegramBot.on("message", async (message) => {
  try {
    console.log(message);

    if (
      message.chat.type === "group" &&
      message.new_chat_member?.username === TELEGRAM_BOT_USERNAME
    ) {
      await onBotAddedToGroup(message);
      resetState();

      return;
    }

    if (
      message.chat.type === "group" &&
      message.left_chat_member?.username === TELEGRAM_BOT_USERNAME
    ) {
      await onBotRemovedFromGroup(message);
      resetState();

      return;
    }

    if (message.chat.type === "group") {
      await onGroupChat(message);
      resetState();

      return;
    }

    if (message.text === "/start") {
      await onStartButton(message);
      resetState();

      return;
    }

    if (!message?.text) {
      resetState();

      return;
    }

    if (waitForManagerResponse) {
      await onWaitManagerResponse(message);
      resetState();

      return;
    }

    await onMessage(message);
    resetState();
  } catch (e) {
    console.error(e);
  }
});

async function onBotAddedToGroup(message) {
  try {
    await groupsCollection.deleteGroups(message);
    await groupsCollection.insertGroup(message);
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

    let groups = await groupsCollection.findGroups({
      "message.from.id": message.from.id,
    });

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
    let reports = await reportsCollection.findReports({
      groupId: parseInt(groupId),
      begin: { $lte: begin },
      end: { $gte: end },
    });

    if (!reports || reports.length === 0) {
      const msgs = await messagesCollection.findMessages({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
      });

      if (!msgs || msgs.length === 0) {
        await telegramBot.sendMessage(
          message.chat.id,
          messages.messagesNotFound
        );

        return;
      } else {
        await telegramBot.sendMessage(message.chat.id, messages.loading);

        const createdReport = await createReport(groupId, begin, end);

        if (!createdReport) {
          await telegramBot.sendMessage(
            message.chat.id,
            messages.reportsNotFound
          );

          return;
        }

        reports = await reportsCollection.findReports({
          groupId: parseInt(groupId),
          begin: { $lte: begin },
          end: { $gte: end },
        });

        if (!reports || reports.length === 0) {
          await telegramBot.sendMessage(
            message.chat.id,
            messages.reportsNotFound
          );

          return;
        }
      }
    }

    const encrypt = utils.crypt(process.env.SECRET_KEY, `${groupId}`);

    await telegramBot.sendMessage(
      message.chat.id,
      messages.read.replace(":field", `${process.env.DASHBOARD_URL}/${encrypt}`)
    );
  } catch (e) {
    console.error(e);
  }
}

async function onTuneButton(message, groupId) {
  try {
    const { begin, end } = utils.getYesterday();
    const reports = await reportsCollection.findReports({
      groupId: parseInt(groupId),
      begin: { $lte: begin },
      end: { $gte: end },
    });

    if (!reports || reports.length === 0) {
      await telegramBot.sendMessage(message.chat.id, messages.readBeforeTune);

      return;
    }

    waitForManagerResponse = true;

    await telegramBot.sendMessage(message.chat.id, messages.tune);
  } catch (e) {
    console.error(e);
  }
}

async function onWaitManagerResponse(message) {
  try {
    waitForManagerResponse = false;

    telegramBot.sendMessage(message.chat.id, messages.loading);

    const { begin, end } = utils.getYesterday();
    const report = await reportsCollection.findReport({
      groupId: parseInt(groupId),
      begin: { $lte: begin },
      end: { $gte: end },
    });

    if (!report || report.length === 0) {
      await telegramBot.sendMessage(message.chat.id, messages.readBeforeTune);

      return;
    }

    const response = await getTunerResponse(
      message.text,
      report?.austin,
      report?.searle,
      report?.sentiment,
      report?.expression,
      report?.distribution
    );

    if (response) {
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: messages.contactFacilitator,
                callback_data: JSON.stringify({
                  command: "facilitator",
                }),
              },
            ],
          ],
        },
      };
      await telegramBot.sendMessage(message.chat.id, response);
      await telegramBot.sendMessage(
        message.chat.id,
        messages.contactFacilitatorText,
        opts
      );
    }
  } catch (e) {
    console.error(e);
  }
}

async function createReport(groupId, begin, end) {
  try {
    const countTags = await messagesCollection.countTags(groupId, begin, end);

    if (!countTags) {
      return false;
    }

    const analysises = await analyseTags(
      countTags.countSearleTags,
      countTags.countIllocutionaryTags,
      countTags.countLocutionaryTags,
      countTags.countExpressionTags,
      countTags.countSentimentTags,
      countTags.countDistributionTags
    );

    await reportsCollection.deleteReports(groupId, begin, end);
    await reportsCollection.insertReport(
      analysises.searleAnalyse,
      analysises.austinAnalyse,
      analysises.sentimentAnalyse,
      analysises.expressionAnalyse,
      analysises.distributionAnalyse,
      Math.floor(new Date().getTime() / 1000),
      groupId,
      begin,
      end
    );

    return true;
  } catch {
    return false;
  }
}

async function onMessage(message) {
  try {
    const responses = await getMetisResponses(message.text);
    const tags = getTags(
      responses.austinResponse?.content,
      responses.searleResponse?.content,
      responses.sentimentResponse?.content,
      responses.expressionResponse?.content,
      responses.distributionResponse?.content
    );
    messagesCollection.addMessage({
      ...message,
      metis_response: responses,
      tags,
    });
  } catch {}
}

function resetState() {
  waitForManagerResponse = false;
  groupId = null;
}
