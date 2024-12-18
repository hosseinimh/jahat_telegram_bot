var express = require("express");
require("dotenv").config();
const messagesCollection = require("../services/db/collections/Message");
const reportsCollection = require("../services/db/collections/Report");
const RESULT_CODES = require("../types/resultCodes");
const utils = require("../utils/utils");
const { getLocale } = require("../utils/utils");

const router = express.Router();
const messages = getLocale().messages;

router.post("/:groupId", async function (req, res) {
  if (!req.params.groupId) {
    return res.json({
      result: "0",
      resultCode: RESULT_CODES.FORM_INPUT_INVALID,
      resultMessage: messages.groupIdNotFound,
    });
  }

  const groupId = utils.decrypt(
    process.env.SECRET_KEY,
    `${req.params.groupId}`
  );

  if (isNaN(groupId) || groupId >= 0) {
    return res.json({
      result: "0",
      resultCode: RESULT_CODES.FORM_INPUT_INVALID,
      resultMessage: messages.groupIdNotFound,
    });
  }

  const { begin, end } = utils.get30DaysPeriod();
  const countTags = await messagesCollection.countTags(groupId, begin, end);
  const report = await reportsCollection.findReport({
    groupId: parseInt(groupId),
    begin: { $lte: begin },
    end: { $gte: end },
  });

  res.json({
    result: "1",
    resultData: {
      countTags,
      report: {
        searle: report.searle,
        austin: report.austin,
        distribution: report.distribution,
        expression: report.expression,
        sentiment: report.sentiment,
      },
    },
  });
});

module.exports = router;
