const express = require("express");
const router = express.Router();

const commentController = require("../controllers/CommentController");

router.get("/:campaignId", commentController.getByCampaign);
router.post("/create", commentController.create);
router.get("/", commentController.index);

module.exports = router;
