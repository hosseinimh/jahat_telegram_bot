var express = require("express");
const messageCollection = require("../services/db/collections/Message");

var router = express.Router();

router.post("/", async function (req, res, next) {
  const illocutionaries = await messageCollection.countIllocutionaryTags();
  const locutionaries = await messageCollection.countLocutionaryTags();
  const searles = await messageCollection.countSearleTags();
  const expressions = await messageCollection.countExpressionTags();
  const sentiments = await messageCollection.countSentimentTags();
  const distributions = await messageCollection.countDistributionTags();

  res.json({
    result: "1",
    resultData: {
      illocutionaries,
      locutionaries,
      searles,
      expressions,
      sentiments,
      distributions,
    },
  });
});

router.get("/", async function (req, res, next) {
  const value = await messageCollection.countIllocutionaryTags();
  res.json(value);
});

module.exports = router;
