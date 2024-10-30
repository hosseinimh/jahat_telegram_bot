const { connectToCluster } = require("../DbService");

const COLLECTION_NAME = "reports";

async function findReport(query) {
  let mongoClient;
  let document = null;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    document = await collection.findOne(query);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();

    return document;
  }
}

async function addReport(searle, austin, distribution, expression, sentiment) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    await collection.insertOne({
      searle,
      austin,
      distribution,
      expression,
      sentiment,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

async function deleteAllReports() {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    await collection.deleteMany({});
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

const reportCollection = { findReport, addReport, deleteAllReports };

module.exports = reportCollection;
