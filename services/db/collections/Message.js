const { connectToCluster } = require("../DbService");

async function addMessage(message) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection("messages");

    await insertMessage(collection, message);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

async function insertMessage(collection, message) {
  await collection.insertOne(message);
}

const messageCollection = { addMessage };

module.exports = messageCollection;
