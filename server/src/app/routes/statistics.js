const express = require("express");
const router = express.Router();

const statisticController = require("../controllers/StatisticController");

router.get("/", statisticController.index);

module.exports = router;
