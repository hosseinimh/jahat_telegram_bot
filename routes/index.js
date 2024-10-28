var express = require("express");
require("../services/telegram/TelegramService");

var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
