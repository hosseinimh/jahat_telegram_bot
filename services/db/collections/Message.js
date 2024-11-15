const { connectToCluster } = require("../DbService");
const SEARLE_TAGS = require("../../../types/searleTags");
const ILLOCUTIONARY_TAGS = require("../../../types/illocutionaryTags");
const LOCUTIONARY_TAGS = require("../../../types/locutionaryTags");
const DISTRIBUTION_TAGS = require("../../../types/distributionTags");
const EXPRESSION_TAGS = require("../../../types/expressionTags");
const SENTIMENT_TAGS = require("../../../types/sentimentTags");

const COLLECTION_NAME = "messages";

async function handleCountTags(query) {
  let mongoClient;
  let count = 0;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);
    count = await collection.countDocuments(query);
  } catch (e) {
    console.error("error", e);
  } finally {
    await mongoClient.close();

    return count;
  }
}

async function countSearleTags(groupId, begin, end) {
  try {
    const count = SEARLE_TAGS.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.searleTags": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countIllocutionaryTags(groupId, begin, end) {
  try {
    let count = ILLOCUTIONARY_TAGS.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.austinTags.illocutionary": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countLocutionaryTags(groupId, begin, end) {
  try {
    const count = LOCUTIONARY_TAGS.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.austinTags.locutionary": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countDistributionTags(groupId, begin, end) {
  try {
    const count = DISTRIBUTION_TAGS.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.distributionTags": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countExpressionTags(groupId, begin, end) {
  try {
    const count = EXPRESSION_TAGS.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.expressionTags": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function countSentimentTags(groupId, begin, end) {
  try {
    let count = SENTIMENT_TAGS.map(async (tag) => {
      const count = await handleCountTags({
        "chat.id": parseInt(groupId),
        "chat.type": "group",
        date: { $gte: begin, $lte: end },
        "tags.sentimentTags": { $in: [tag] },
      });

      return { tag, count };
    });

    return await Promise.all(count);
  } catch (e) {
    console.error("error", e);

    return null;
  }
}

async function insertMessage(message) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    await collection.insertOne(message);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

async function countTags(groupId, begin, end) {
  try {
    const searleTags = await countSearleTags(groupId, begin, end);
    const illocutionaryTags = await countIllocutionaryTags(groupId, begin, end);
    const locutionaryTags = await countLocutionaryTags(groupId, begin, end);
    const distributionTags = await countDistributionTags(groupId, begin, end);
    const expressionTags = await countExpressionTags(groupId, begin, end);
    const sentimentTags = await countSentimentTags(groupId, begin, end);

    return {
      countSearleTags: searleTags,
      countIllocutionaryTags: illocutionaryTags,
      countLocutionaryTags: locutionaryTags,
      countDistributionTags: distributionTags,
      countExpressionTags: expressionTags,
      countSentimentTags: sentimentTags,
    };
  } catch (e) {
    console.error(e);

    return null;
  }
}

async function findMessages(query) {
  let mongoClient;
  let messages = null;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    messages = collection.find(query);
    messages = await messages.toArray();
  } catch (e) {
    messages = null;
    console.error(e);
  } finally {
    await mongoClient.close();

    return messages;
  }
}

const messagesCollection = {
  insertMessage,
  countTags,
  findMessages,
};

module.exports = messagesCollection;
