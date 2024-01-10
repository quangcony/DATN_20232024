const express = require("express");
const router = express.Router();

const campaignController = require("../controllers/CampaignController");

router.get("/featured", campaignController.getFeaturedCampaign);
// router.get("/query", campaignController.getCampaignsByFields);

router.get("/recommender/search", campaignController.searchRecommend);
router.get("/recommender/:userId", campaignController.recommender);
router.get(
  "/recommender/related/:campaignId",
  campaignController.relatedRecommend
);

router.patch("/:campaignId/like", campaignController.like);
router.patch("/:campaignId/unlike", campaignController.unlike);
router.get("/getCampaignsByUser/:slug", campaignController.getCampaignsByUser);
router.get("/getCampaignsByTag/:hashtag", campaignController.getCampaignsByTag);
router.get("/getCampaignsByGenre", campaignController.getCampaignsByGenre);
router.get("/getCampaignsByQuery", campaignController.getCampaignsByQuery);
router.post("/getCampaignsByNearyou", campaignController.getCampaignsByNearyou);

router.post("/create", campaignController.create);
router.patch("/:id", campaignController.update);
router.get("/:slug", campaignController.show);
router.get("/", campaignController.index);

module.exports = router;
