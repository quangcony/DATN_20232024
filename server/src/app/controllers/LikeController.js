const { default: mongoose } = require("mongoose");
const Like = require("../models/Like");

class LikeController {
  //[GET]: /likes
  index(req, res, next) {
    Like.find({})
      .then((like) => res.json(like))
      .catch(next);
  }

  //[GET]: /likes/getLike/:campaignId
  getLikeByCampaign(req, res, next) {
    const castCampaignId = (campaignId) =>
      new mongoose.Types.ObjectId(campaignId);
    const id = castCampaignId(req.params.campaignId);

    Like.aggregate([
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
      .then((likes) => res.json(likes))
      .catch(next);
  }

  // [POST]: /likes/create
  create(req, res) {
    const like = new Like(req.body);
    like
      .save()
      .then(() => res.json({ message: "Tạo mới like thành công!" }))
      .catch((error) => res.json({ error }));
  }

  // [PATCH]: /likes/update/:id
  update(req, res) {
    Like.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.json({ message: "Cập nhật Thích/ Bỏ thích thành công!" }))
      .catch(next);
  }
}

module.exports = new LikeController();
