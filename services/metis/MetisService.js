const axios = require("axios");
const { fa2enDigits } = require("../../utils/utils");

const createConfig = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.METIS_API_KEY,
    },
  };

  return config;
};

let austinSession = null;
let searleSession = null;
let sentimentSession = null;
let expressiontSession = null;
let distributionSession = null;
let searleAnalysorSession = null;
let austinAnalysorSession = null;
let distributionAnalysorSession = null;
let expressionAnalysorSession = null;
let sentimentAnalysorSession = null;
let tunerSession = null;

async function createSession(botId) {
  const data = { botId, user: null };
  const response = await axios.post(
    `https://api.metisai.ir/api/v1/chat/session`,
    data,
    createConfig()
  );

  return response.data;
}

async function handleResponse(session, createSession, message) {
  let result = null;

  try {
    if (!session) {
      session = await createSession();
    }

    const data = { message: { content: message }, type: "USER" };
    const response = await axios.post(
      `https://api.metisai.ir/api/v1/chat/session/${session.id}/message`,
      data,
      createConfig()
    );

    result = response.data;
  } catch (e) {
    console.error(e);
  } finally {
    return result;
  }
}

async function createAustinSession() {
  return await createSession("0226b5cf-3305-4930-a393-ff9023da7b82");
}

async function createSearleSession() {
  return await createSession("769899f6-9a24-41e1-b3c4-d01bfe9f2784");
}

async function createSentimentSession() {
  return await createSession("853070b5-82a8-4455-b2e8-cf96c43ad998");
}

async function createExpressionSession() {
  return await createSession("ddf208f3-49b5-452f-8d07-a8240f93fa32");
}

async function createDistributionSession() {
  return await createSession("e54a0f28-61ab-41df-aa8e-c21677ba5242");
}

async function createSearleAnalysorSession() {
  return await createSession("f9d8a5c4-ed56-4009-b313-23d55a30ebb7");
}

async function createAustinAnalysorSession() {
  return await createSession("c3e7e298-71e3-4c02-975d-5e0886e7a8f9");
}

async function createDistributionAnalysorSession() {
  return await createSession("d418972a-99f1-459e-a58d-26bd18261bfa");
}

async function createExpressionAnalysorSession() {
  return await createSession("e9f9c78b-3eb1-4caa-8306-3c9303428339");
}

async function createSentimentAnalysorSession() {
  return await createSession("e578cf54-d8e8-483c-9fd2-e2f96143e8dd");
}

async function createTunerSession() {
  return await createSession("9ca1ae5b-a6b5-41fb-b2b0-63592f7483fc");
}

async function getAustinResponse(message) {
  return await handleResponse(austinSession, createAustinSession, message);
}

async function getSearleResponse(message) {
  return await handleResponse(searleSession, createSearleSession, message);
}

async function getSentimentResponse(message) {
  return await handleResponse(
    sentimentSession,
    createSentimentSession,
    message
  );
}

async function getExpressionResponse(message) {
  return await handleResponse(
    expressiontSession,
    createExpressionSession,
    message
  );
}

async function getDistributionResponse(message) {
  return await handleResponse(
    distributionSession,
    createDistributionSession,
    message
  );
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
          searleAnalysorSession,
          createSearleAnalysorSession,
          message
        );

        return response?.content;
      }
    }

    return null;
  } catch {
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
          sentimentAnalysorSession,
          createSentimentAnalysorSession,
          message
        );

        return response?.content;
      }
    }

    return null;
  } catch {
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
        austinAnalysorSession,
        createAustinAnalysorSession,
        message
      );

      return response?.content;
    }

    return null;
  } catch {
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
          distributionAnalysorSession,
          createDistributionAnalysorSession,
          message
        );

        return response?.content;
      }
    }

    return null;
  } catch {
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
          expressionAnalysorSession,
          createExpressionAnalysorSession,
          message
        );

        return response?.content;
      }
    }

    return null;
  } catch {
    return null;
  }
}

async function getTunerResponse(
  managerMessage,
  austinContent,
  searleContent,
  sentimentContent,
  expressionContent,
  distributionContent
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
      tunerSession,
      createTunerSession,
      message
    );

    return response?.content;
  } catch {
    return null;
  }
}

async function analyseTags(
  countSearleTags,
  countIllocutionaryTags,
  countLocutionaryTags,
  countExpressionTags,
  countSentimentTags,
  countDistributionTags
) {
  try {
    const searleAnalyse = await getSearleAnalysorResponse(countSearleTags);
    const austinAnalyse = await getAustinAnalysorResponse(
      countIllocutionaryTags,
      countLocutionaryTags
    );
    const sentimentAnalyse = await getSentimentAnalysorResponse(
      countSentimentTags
    );
    const expressionAnalyse = await getExpressionAnalysorResponse(
      countExpressionTags
    );
    const distributionAnalyse = await getDistributionAnalysorResponse(
      countDistributionTags
    );

    return {
      searleAnalyse,
      austinAnalyse,
      sentimentAnalyse,
      expressionAnalyse,
      distributionAnalyse,
    };
  } catch {
    return null;
  }
}

async function getMetisResponses(messages) {
  const austinResponse = await getAustinResponse(messages);
  const searleResponse = await getSearleResponse(messages);
  const sentimentResponse = await getSentimentResponse(messages);
  const expressionResponse = await getExpressionResponse(messages);
  const distributionResponse = await getDistributionResponse(messages);

  return {
    austinResponse,
    searleResponse,
    sentimentResponse,
    expressionResponse,
    distributionResponse,
  };
}

function getTags(
  austinContent,
  searleContent,
  sentimentContent,
  expressionContent,
  distributionContent
) {
  try {
    let tags = {};
    const austinTags = getAustinTags(austinContent);
    const searleTags = getSearleTags(searleContent);
    const sentimentTags = getSentimentTags(sentimentContent);
    const expressionTags = getExpressionTags(expressionContent);
    const distributionTags = getDistributionTags(distributionContent);

    if (austinTags) {
      tags = { ...tags, austinTags };
    }

    if (searleTags?.length > 0) {
      tags = { ...tags, searleTags };
    }

    if (sentimentTags) {
      tags = { ...tags, sentimentTags };
    }

    if (expressionTags) {
      tags = { ...tags, expressionTags };
    }

    if (distributionTags?.length > 0) {
      tags = { ...tags, distributionTags };
    }

    return tags;
  } catch {
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
    console.error(e);

    return null;
  }
}

function getSearleTags(content) {
  try {
    let tags = content.trim().split("، ");

    return tags?.length > 0 ? tags : null;
  } catch (e) {
    console.error(e);

    return null;
  }
}

function getSentimentTags(content) {
  return content ?? null;
}

function getExpressionTags(content) {
  const tag = fa2enDigits(content?.trim());

  return isNaN(tag) ? null : parseInt(tag);
}

function getDistributionTags(content) {
  try {
    const tags = content.trim().split("، ");

    return tags?.length > 0 ? tags : null;
  } catch (e) {
    console.error(e);

    return null;
  }
}

module.exports = { getMetisResponses, getTags, analyseTags, getTunerResponse };
