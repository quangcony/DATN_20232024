const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");

class CommentController {
  //[GET]: /comments
  index(req, res, next) {
    Comment.find({})
      .then((comments) => res.json(comments))
      .catch(next);
  }

  //[GET]: /comments/:campaignId
  getByCampaign(req, res, next) {
    // Comment.find({ campaignId: req.params.campaignId })
    //   .then((comments) => res.json(comments))
    //   .catch(next);
    const castCampaignId = (campaignId) =>
      new mongoose.Types.ObjectId(campaignId);
    const id = castCampaignId(req.params.campaignId);

    Comment.aggregate([
      {
        $match: {
          campaignId: id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
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
      .then((comments) => res.json(comments))
      .catch(next);
  }

  // [POST]: /campaigns/create
  create(req, res) {
    const comment = new Comment(req.body);
    comment
      .save()
      .then(() => res.json({ message: "Tạo mới comment thành công!" }))
      .catch((error) => res.json({ error }));
  }
}

module.exports = new CommentController();
