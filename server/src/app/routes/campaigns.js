const express = require("express");
const router = express.Router();

const campaignController = require("../controllers/CampaignController");

router.get("/featured", campaignController.getFeaturedCampaign);
router.get("/query", campaignController.getCampaignsByFields);
router.post("/create", campaignController.create);
router.patch("/:id", campaignController.update);
router.get("/:slug", campaignController.show);
router.get("/", campaignController.index);

module.exports = router;
