const express = require("express");
const router = express.Router();

const likeController = require("../controllers/LikeController");

router.get("/getLikesByCampaign/:campaignId", likeController.getLikeByCampaign);
router.post("/create", likeController.create);
router.post("/update/:id", likeController.update);
router.get("/", likeController.index);

module.exports = router;
