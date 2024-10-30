var express = require("express");
const messageCollection = require("../services/db/collections/Message");
const reportCollection = require("../services/db/collections/Report");
const { analysors } = require("../services/metis/MetisService");

var router = express.Router();

router.post("/", async function (req, res, next) {
  const illocutionaries = await messageCollection.countIllocutionaryTags();
  const locutionaries = await messageCollection.countLocutionaryTags();
  const searles = await messageCollection.countSearleTags();
  const expressions = await messageCollection.countExpressionTags();
  const sentiments = await messageCollection.countSentimentTags();
  const distributions = await messageCollection.countDistributionTags();
  const searlesAnalysis = await analysors.getSearleAnalysorResponse(searles);
  const austinAnalysis = await analysors.getAustinAnalysorResponse(
    illocutionaries,
    locutionaries
  );
  const distributionAnalysis = await analysors.getDistributionAnalysorResponse(
    distributions
  );
  const expressionAnalysis = await analysors.getExpressionAnalysorResponse(
    expressions
  );
  const sentimentAnalysis = await analysors.getSentimentAnalysorResponse(
    sentiments
  );

  await reportCollection.deleteAllReports();
  await reportCollection.addReport(
    searlesAnalysis,
    austinAnalysis,
    distributionAnalysis,
    expressionAnalysis,
    sentimentAnalysis
  );

  res.json({
    result: "1",
    resultData: {
      illocutionaries,
      locutionaries,
      searles,
      expressions,
      sentiments,
      distributions,
      searlesAnalysis,
      austinAnalysis,
      distributionAnalysis,
      expressionAnalysis,
      sentimentAnalysis,
    },
  });
});

router.get("/", async function (req, res, next) {
  const value = await messageCollection.countIllocutionaryTags();
  res.json(value);
});

module.exports = router;
