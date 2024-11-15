require("dotenv").config();
const { MongoClient } = require("mongodb");

async function connectToCluster() {
  try {
    const mongoClient = new MongoClient(process.env.DB_URI);

    await mongoClient.connect();

    return mongoClient;
  } catch (e) {
    console.error("Connection to MongoDB Atlas failed!", e);
    process.exit();
  }
}

module.exports = { connectToCluster };
