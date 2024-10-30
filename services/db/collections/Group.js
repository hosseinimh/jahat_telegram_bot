const { connectToCluster } = require("../DbService");

const COLLECTION_NAME = "groups";

async function insertGroup(message) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    await collection.insertOne({
      message,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

async function deleteGroups(message) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    await collection.deleteMany({
      "message.from.id": message.from.id,
      "message.chat.id": message.chat.id,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

async function findGroup(query) {
  let mongoClient;
  let group = null;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    group = await collection.findOne(query);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();

    return group;
  }
}

async function findGroups(query) {
  let mongoClient;
  let groups = null;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    groups = collection.find(query);
    groups = await groups.toArray();
  } catch (e) {
    groups = null;
    console.error(e);
  } finally {
    await mongoClient.close();

    return groups;
  }
}

const groupsCollection = {
  insertGroup,
  deleteGroups,
  findGroup,
  findGroups,
};

module.exports = groupsCollection;
