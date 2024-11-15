const { connectToCluster } = require("../DbService");

const COLLECTION_NAME = "errors";

async function insertError(e) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    if (!(e instanceof Error)) {
      e = new Error(e);
    }

    await collection.insertOne({
      fileName: e.fileName,
      lineNumber: e.lineNumber,
      message: e.message,
      stack: e.stack,
      date: Math.floor(new Date().getTime() / 1000),
    });
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

const errorCollection = {
  insertError,
};

module.exports = errorCollection;
