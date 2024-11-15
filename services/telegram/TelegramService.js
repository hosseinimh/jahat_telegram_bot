require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const messagesCollection = require("../db/collections/Message");
const reportsCollection = require("../db/collections/Report");
const groupsCollection = require("../db/collections/Group");
const errorsCollection = require("../db/collections/Error");
const metisService = require("../metis/MetisService");
const utils = require("../../utils/utils");

const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});
const TELEGRAM_BOT_USERNAME = "TeamTuneBot";
const messages = utils.getLocale().messages;
const buttons = utils.getLocale().buttons;
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
  console.log(message);
  try {
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

    if (message.text === "/start") {
      if (message.chat.type === "group") {
        await onGroupChat(message);
        resetState();

        return;
      } else if (message.chat.type === "private") {
        await onStartButton(message);
      }

      resetState();

      return;
    }

    if (!message?.text) {
      resetState();

      return;
    }

    if (waitForManagerResponse && message.chat.type === "private") {
      await onWaitManagerResponse(message);
      resetState();

      return;
    }

    if (message.chat.type === "group") {
      await onMessage(message);
      resetState();
    }
  } catch (e) {
    errorsCollection.insertError(e);
  }
});

async function onBotAddedToGroup(message) {
  try {
    await groupsCollection.deleteGroups(message);
    await groupsCollection.insertGroup(message);
  } catch (e) {
    errorsCollection.insertError(e);
  }
}

async function onBotRemovedFromGroup(message) {
  try {
    await groupsCollection.deleteGroups(message);
  } catch (e) {
    errorsCollection.insertError(e);
  }
}

async function onGroupChat(message) {
  try {
    await telegramBot.sendMessage(
      message.chat.id,
      messages.groupChatNotAvailable
    );
  } catch (e) {
    errorsCollection.insertError(e);
  }
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
    errorsCollection.insertError(e);
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
  } catch (e) {
    errorsCollection.insertError(e);
  }
}

async function onReadButton(message, groupId) {
  try {
    const oneDayPeriod = utils.get1DayPeriod();
    const sevenDaysPeriod = utils.get7DaysPeriod();
    const thirtyDaysPeriod = utils.get30DaysPeriod();

    await telegramBot.sendMessage(message.chat.id, messages.loading);

    const result = await getOrCreateReport(
      groupId,
      thirtyDaysPeriod.begin,
      thirtyDaysPeriod.end
    );

    if (!result.reports) {
      await telegramBot.sendMessage(message.chat.id, result.error);

      return;
    }

    const encrypt = utils.crypt(process.env.SECRET_KEY, `${groupId}`);

    await telegramBot.sendMessage(
      message.chat.id,
      messages.read.replace(":field", `${process.env.DASHBOARD_URL}/${encrypt}`)
    );

    getOrCreateReport(groupId, oneDayPeriod.begin, oneDayPeriod.end);
    getOrCreateReport(groupId, sevenDaysPeriod.begin, sevenDaysPeriod.end);
  } catch (e) {
    errorsCollection.insertError(e);
  }
}

async function onTuneButton(message, groupId) {
  try {
    const { begin, end } = utils.get30DaysPeriod();
    const reports = await reportsCollection.findReports({
      groupId: parseInt(groupId),
      begin,
      end,
    });

    if (!reports || reports.length === 0) {
      await telegramBot.sendMessage(message.chat.id, messages.readBeforeTune);

      return;
    }

    waitForManagerResponse = true;

    await telegramBot.sendMessage(message.chat.id, messages.tune);
  } catch (e) {
    errorsCollection.insertError(e);
  }
}

async function onWaitManagerResponse(message) {
  try {
    waitForManagerResponse = false;

    await telegramBot.sendMessage(message.chat.id, messages.loading);

    const { begin, end } = utils.get30DaysPeriod();
    const report = await reportsCollection.findReport({
      groupId: parseInt(groupId),
      begin,
      end,
    });

    if (!report || report.length === 0) {
      await telegramBot.sendMessage(message.chat.id, messages.readBeforeTune);

      return;
    }

    const response = await metisService.getTunerResponse(
      message.text,
      report?.searle,
      report?.austin,
      report?.distribution,
      report?.expression,
      report?.sentiment
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
    errorsCollection.insertError(e);
  }
}

async function createReport(groupId, begin, end) {
  try {
    const countTags = await messagesCollection.countTags(groupId, begin, end);

    if (!countTags) {
      return false;
    }

    const analysises = await metisService.analyseTags(
      countTags.countSearleTags,
      countTags.countIllocutionaryTags,
      countTags.countLocutionaryTags,
      countTags.countDistributionTags,
      countTags.countExpressionTags,
      countTags.countSentimentTags
    );

    await reportsCollection.deleteReports(groupId, begin, end);
    await reportsCollection.insertReport(
      analysises.searleAnalyse,
      analysises.austinAnalyse,
      analysises.distributionAnalyse,
      analysises.expressionAnalyse,
      analysises.sentimentAnalyse,
      groupId,
      begin,
      end
    );

    return true;
  } catch (e) {
    errorsCollection.insertError(e);

    return false;
  }
}

async function onMessage(message) {
  try {
    const responses = await metisService.getMetisResponses(message.text);
    const tags = metisService.getTags(
      responses.searleResponse?.content,
      responses.austinResponse?.content,
      responses.distributionResponse?.content,
      responses.expressionResponse?.content,
      responses.sentimentResponse?.content
    );
    messagesCollection.insertMessage({
      ...message,
      metis_response: responses,
      tags,
    });
  } catch (e) {
    errorsCollection.insertError(e);
  }
}

function resetState() {
  waitForManagerResponse = false;
  groupId = null;
}

async function getOrCreateReport(groupId, begin, end) {
  try {
    let reports = await reportsCollection.findReports({
      groupId: parseInt(groupId),
      begin,
      end,
    });

    if (!reports || reports.length === 0) {
      const msgs = await messagesCollection.findMessages({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
      });

      if (!msgs || msgs.length === 0) {
        return { reports: null, error: messages.messagesNotFoundIn30DayPeriod };
      } else {
        const createdReport = await createReport(groupId, begin, end);

        if (!createdReport) {
          return {
            reports: null,
            error: messages.reportsCreatingError,
          };
        }

        reports = await reportsCollection.findReports({
          groupId: parseInt(groupId),
          begin,
          end,
        });

        if (!reports || reports.length === 0) {
          return {
            reports: null,
            error: messages.reportsNotFoundIn30DayPeriod,
          };
        }
      }
    }

    return { reports, error: null };
  } catch (e) {
    errorsCollection.insertError(e);

    return { reports: null, error: messages.reportsCreatingError };
  }
}
