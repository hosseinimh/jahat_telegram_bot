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

    console.log("austinTags", austinTags);
    console.log("searleTags", searleTags);
    console.log("sentimentTags", sentimentTags);
    console.log("expressionTags", expressionTags);
    console.log("distributionTags", distributionTags);

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

module.exports = { getMetisResponses, getTags };
