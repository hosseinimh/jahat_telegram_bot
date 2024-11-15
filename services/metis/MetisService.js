const axios = require("axios");
const errorsCollection = require("../db/collections/Error");
const { fa2enDigits } = require("../../utils/utils");

let sessions = {
  searleSession: null,
  austinSession: null,
  distributionSession: null,
  expressiontSession: null,
  sentimentSession: null,
  searleAnalysorSession: null,
  austinAnalysorSession: null,
  distributionAnalysorSession: null,
  expressionAnalysorSession: null,
  sentimentAnalysorSession: null,
  tunerSession: null,
};

const createConfig = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.METIS_API_KEY,
    },
  };

  return config;
};

async function createSession(botId) {
  try {
    const data = { botId, user: null };
    const response = await axios.post(
      `https://api.metisai.ir/api/v1/chat/session`,
      data,
      createConfig()
    );

    return response.data;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

async function handleResponse(session, botId, message) {
  try {
    if (!sessions[session]) {
      sessions[session] = await createSession(botId);
    }

    const data = { message: { content: message, type: "USER" } };
    const response = await axios.post(
      `https://api.metisai.ir/api/v1/chat/session/${sessions[session].id}/message`,
      data,
      createConfig()
    );

    return response.data;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

const botIds = {
  searle: "769899f6-9a24-41e1-b3c4-d01bfe9f2784",
  austin: "0226b5cf-3305-4930-a393-ff9023da7b82",
  distribution: "e54a0f28-61ab-41df-aa8e-c21677ba5242",
  expression: "ddf208f3-49b5-452f-8d07-a8240f93fa32",
  sentiment: "853070b5-82a8-4455-b2e8-cf96c43ad998",
  searleAnalysor: "f9d8a5c4-ed56-4009-b313-23d55a30ebb7",
  austinAnalysor: "c3e7e298-71e3-4c02-975d-5e0886e7a8f9",
  distributionAnalysor: "d418972a-99f1-459e-a58d-26bd18261bfa",
  expressionAnalysor: "e9f9c78b-3eb1-4caa-8306-3c9303428339",
  sentimentAnalysor: "e578cf54-d8e8-483c-9fd2-e2f96143e8dd",
  tuner: "9ca1ae5b-a6b5-41fb-b2b0-63592f7483fc",
};

async function getSearleResponse(message) {
  return await handleResponse("searleSession", botIds.searle, message);
}

async function getAustinResponse(message) {
  return await handleResponse("austinSession", botIds.austin, message);
}

async function getDistributionResponse(message) {
  return await handleResponse(
    "distributionSession",
    botIds.distribution,
    message
  );
}

async function getExpressionResponse(message) {
  return await handleResponse("expressiontSession", botIds.expression, message);
}

async function getSentimentResponse(message) {
  return await handleResponse("sentimentSession", botIds.sentiment, message);
}

async function getSearleAnalysorResponse(items) {
  try {
    if (items?.length > 0) {
      let count = 0;
      let message = "";

      items = items.filter((item) => item.count > 0);

      items.forEach((item) => {
        count += item.count;
      });

      if (count > 0) {
        message = "تعداد کل پیام‌ها " + count + " می‌باشد. ";

        items.forEach((item) => {
          message +=
            Math.floor((item.count / count) * 100) +
            "% پیام‌ها حاوی " +
            item.tag +
            " می‌باشد. ";
        });

        const response = await handleResponse(
          "searleAnalysorSession",
          botIds.searleAnalysor,
          message
        );

        return response?.content;
      }
    }

    return null;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

async function getAustinAnalysorResponse(illocutionaries, locutionaries) {
  try {
    let illocutionariesCount = 0;
    let illocutionariesMessage = "";
    let locutionariesCount = 0;
    let locutionariesMessage = "";

    if (illocutionaries?.length > 0) {
      illocutionaries = illocutionaries.filter((item) => item.count > 0);

      illocutionaries.forEach((item) => {
        illocutionariesCount += item.count;
      });

      if (illocutionariesCount > 0) {
        illocutionariesMessage =
          "تعداد کل پیام‌ها " + illocutionariesCount + " می‌باشد. ";

        illocutionaries.forEach((item) => {
          illocutionariesMessage +=
            Math.floor((item.count / illocutionariesCount) * 100) +
            "% پیام‌ها حاوی " +
            item.tag +
            " می‌باشد. ";
        });
      }
    }

    if (locutionaries?.length > 0) {
      locutionaries = locutionaries.filter((item) => item.count > 0);

      locutionaries.forEach((item) => {
        locutionariesCount += item.count;
      });

      if (locutionariesCount > 0) {
        locutionariesMessage =
          "تعداد کل پیام‌ها " + locutionariesCount + " می‌باشد. ";

        locutionaries.forEach((item) => {
          locutionariesMessage +=
            Math.floor((item.count / locutionariesCount) * 100) +
            "% پیام‌ها حاوی " +
            item.tag +
            " می‌باشد. ";
        });
      }
    }

    let message = "";

    message += illocutionariesCount > 0 ? illocutionariesMessage : message;
    message += locutionariesCount > 0 ? locutionariesMessage : message;

    if (message?.length > 0) {
      const response = await handleResponse(
        "austinAnalysorSession",
        botIds.austinAnalysor,
        message
      );

      return response?.content;
    }

    return null;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

async function getDistributionAnalysorResponse(items) {
  try {
    if (items?.length > 0) {
      let count = 0;
      let message = "";

      items = items.filter((item) => item.count > 0);

      items.forEach((item) => {
        count += item.count;
      });

      if (count > 0) {
        message = "تعداد کل پیام‌ها " + count + " می‌باشد. ";

        items.forEach((item) => {
          message +=
            Math.floor((item.count / count) * 100) +
            "% پیام‌ها حاوی " +
            item.tag +
            " می‌باشد. ";
        });

        const response = await handleResponse(
          "distributionAnalysorSession",
          botIds.distributionAnalysor,
          message
        );

        return response?.content;
      }
    }

    return null;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

async function getExpressionAnalysorResponse(items) {
  try {
    if (items?.length > 0) {
      let count = 0;
      let message = "";

      items = items.filter((item) => item.count > 0);

      items.forEach((item) => {
        count += item.count;
      });

      if (count > 0) {
        message = "تعداد کل پیام‌ها " + count + " می‌باشد. ";

        items.forEach((item) => {
          message +=
            Math.floor((item.count / count) * 100) +
            "% پیام‌ها حاوی " +
            item.tag +
            " می‌باشد. ";
        });

        const response = await handleResponse(
          "expressionAnalysorSession",
          botIds.expressionAnalysor,
          message
        );

        return response?.content;
      }
    }

    return null;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

async function getSentimentAnalysorResponse(items) {
  try {
    if (items?.length > 0) {
      let count = 0;
      let message = "";

      items = items.filter((item) => item.count > 0);

      items.forEach((item) => {
        count += item.count;
      });

      if (count > 0) {
        message = "تعداد کل پیام‌ها " + count + " می‌باشد. ";

        items.forEach((item) => {
          message +=
            Math.floor((item.count / count) * 100) +
            "% پیام‌ها حاوی " +
            item.tag +
            " می‌باشد. ";
        });

        const response = await handleResponse(
          "sentimentAnalysorSession",
          botIds.sentimentAnalysor,
          message
        );

        return response?.content;
      }
    }

    return null;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

async function getTunerResponse(
  managerMessage,
  searleContent,
  austinContent,
  distributionContent,
  expressionContent,
  sentimentContent
) {
  try {
    let message = `توضیح نمودار بیانی و فرابیانی :
${austinContent}

توضیح نمودار کنش‌های گفتاری:
${searleContent}

توضیح نمودار موضوعات پیام‌ها:
${distributionContent}

توضیح نمودار احساسات پیام‌ها:
${sentimentContent}

توضیح نمودار پروجکشن یا اکسپرشن در پیام‌ها:
${expressionContent}

مدیر شرکت با دیدن این گزارش یک رفلکشن و بازخورد نوشته که به این شرح هست:
${managerMessage}

با این توضیحات لطفا یک پیشنهاد کوتاه (حداکثر در دو پاراگراف) بده که مدیر شرکت با چه اقداماتی می‌تونه چند قدم مشکلات ارتباطی منعکس شده در گزارش رو بهبود بده و کمک کنه روابط در سازمان‌شون بهتر بشه.`;

    const response = await handleResponse(
      "tunerSession",
      botIds.tuner,
      message
    );

    return response?.content;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

async function analyseTags(
  countSearleTags,
  countIllocutionaryTags,
  countLocutionaryTags,
  countDistributionTags,
  countExpressionTags,
  countSentimentTags
) {
  try {
    const searleAnalyse = await getSearleAnalysorResponse(countSearleTags);
    const austinAnalyse = await getAustinAnalysorResponse(
      countIllocutionaryTags,
      countLocutionaryTags
    );
    const distributionAnalyse = await getDistributionAnalysorResponse(
      countDistributionTags
    );
    const expressionAnalyse = await getExpressionAnalysorResponse(
      countExpressionTags
    );
    const sentimentAnalyse = await getSentimentAnalysorResponse(
      countSentimentTags
    );

    return {
      searleAnalyse,
      austinAnalyse,
      distributionAnalyse,
      expressionAnalyse,
      sentimentAnalyse,
    };
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

async function getMetisResponses(messages) {
  const searleResponse = await getSearleResponse(messages);
  const austinResponse = await getAustinResponse(messages);
  const distributionResponse = await getDistributionResponse(messages);
  const expressionResponse = await getExpressionResponse(messages);
  const sentimentResponse = await getSentimentResponse(messages);

  return {
    searleResponse,
    austinResponse,
    distributionResponse,
    expressionResponse,
    sentimentResponse,
  };
}

function getTags(
  searleContent,
  austinContent,
  distributionContent,
  expressionContent,
  sentimentContent
) {
  try {
    let tags = {};
    const searleTags = getSearleTags(searleContent);
    const austinTags = getAustinTags(austinContent);
    const distributionTags = getDistributionTags(distributionContent);
    const expressionTags = getExpressionTags(expressionContent);
    const sentimentTags = getSentimentTags(sentimentContent);

    if (searleTags?.length > 0) {
      tags = { ...tags, searleTags };
    }

    if (austinTags) {
      tags = { ...tags, austinTags };
    }

    if (distributionTags?.length > 0) {
      tags = { ...tags, distributionTags };
    }

    if (expressionTags) {
      tags = { ...tags, expressionTags };
    }

    if (sentimentTags) {
      tags = { ...tags, sentimentTags };
    }

    return tags;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

function getSearleTags(content) {
  try {
    let tags = content ? content.trim().split("، ") : null;

    return tags?.length > 0 ? tags : null;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

function getAustinTags(content) {
  try {
    let tags = {};
    const illocutionary = content.match(/(?<=Illocutionary: )(.+)/g);
    const locutionary = content.match(/(?<=Locutionary: )(.+)/g);

    if (illocutionary?.length > 0) {
      tags["illocutionary"] = illocutionary[0].trim().split("، ");
    }

    if (locutionary?.length > 0) {
      tags["locutionary"] = locutionary[0].trim().split("، ");
    }

    return tags;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

function getDistributionTags(content) {
  try {
    const tags = content ? content.trim().split("، ") : null;

    return tags?.length > 0 ? tags : null;
  } catch (e) {
    errorsCollection.insertError(e);

    return null;
  }
}

function getExpressionTags(content) {
  const tag = content ? fa2enDigits(content?.trim()) : null;

  return isNaN(tag) ? null : parseInt(tag);
}

function getSentimentTags(content) {
  return content ?? null;
}

const metisService = {
  getMetisResponses,
  getTags,
  analyseTags,
  getTunerResponse,
};

module.exports = metisService;
