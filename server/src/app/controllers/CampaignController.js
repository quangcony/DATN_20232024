const Campaign = require("../models/Campaign");
const User = require("../models/User");

class CampaignController {
  //[GET]: /campaigns
  index(req, res, next) {
    // Campaign.find({})
    //   .then((campaigns) => res.json(campaigns))
    //   .catch(next);
    Campaign.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $unwind: {
          path: "$User",
          preserveNullAndEmptyArrays: true,
        },
      },

      // {
      //   $project: {
      //     Users: { $arrayElemAt: ["$Users", 0] },
      //   },
      // },
    ])
      .then((campaigns) => res.json(campaigns))
      .catch(next);
  }

  getFeaturedCampaign(req, res, next) {
    Campaign.findOne()
      .sort({ likeCount: -1 })
      .then((campaign) => res.json(campaign))
      .catch(next);
  }

  getCampaignsByFields(req, res, next) {
    Campaign.aggregate([
      {
        $match: req.query,
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $unwind: {
          path: "$User",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
      .then((campaigns) => res.json(campaigns))
      .catch(next);
  }

  // [GET]: /campaigns/:slug
  show(req, res, next) {
    Campaign.findOne({ slug: req.params.slug })
      .then((campaign) => res.json(campaign))
      .catch(next);
  }

  // [POST]: /campaigns/create
  create(req, res) {
    const campaign = new Campaign(req.body);
    campaign
      .save()
      .then(() => res.json({ message: "Tạo mới chiến dịch thành công!" }))
      .catch((error) => res.json({ error }));
  }

  // [PATCH]: /campaigns/:id
  update(req, res, next) {
    Campaign.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.json({ message: "Cập nhật chiến dịch thành công!" }))
      .catch(next);
  }
}

module.exports = new CampaignController();
