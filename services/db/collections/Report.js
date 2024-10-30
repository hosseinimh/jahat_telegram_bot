const { connectToCluster } = require("../DbService");

const COLLECTION_NAME = "reports";

async function findReport(query) {
  let mongoClient;
  let report = null;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    report = await collection.findOne(query);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();

    return report;
  }
}

async function findReports(query) {
  let mongoClient;
  let reports = null;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    reports = collection.find(query);
    reports = await reports.toArray();
  } catch (e) {
    reports = null;
    console.error(e);
  } finally {
    await mongoClient.close();

    return reports;
  }
}

async function insertReport(
  searle,
  austin,
  distribution,
  expression,
  sentiment,
  date,
  groupId,
  begin,
  end
) {
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
      date,
      groupId,
      begin,
      end,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

async function deleteReports(groupId, begin, end) {
  let mongoClient;

  try {
    mongoClient = await connectToCluster(process.env.DB_URI);
    const db = mongoClient.db(process.env.DB);
    const collection = db.collection(COLLECTION_NAME);

    await collection.deleteMany({ groupId, begin, end });
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

const reportCollection = {
  findReport,
  findReports,
  insertReport,
  deleteReports,
};

module.exports = reportCollection;
