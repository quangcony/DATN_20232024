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
  async create(req, res) {
    try {
      const { userId, campaignId } = req.body;

      // Kiểm tra xem like đã tồn tại chưa
      const existingLike = await Like.findOne({ userId, campaignId });

      if (existingLike) {
        if (!existingLike.status) {
          existingLike.status = true; // Thay đổi trạng thái thành true nếu trước đó là false
          await existingLike.save();
          return res.status(200).json({ message: "Thích lại thành công." });
        }
        return res
          .status(400)
          .json({ message: "Bạn đã thích mục tiêu này rồi." });
      }

      const newLike = new Like(req.body);
      await newLike.save();

      res.status(200).json({ message: "Thích thành công." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server." });
    }
  }

  // [PATCH]: /likes/update/
  async update(req, res) {
    try {
      const { userId, campaignId } = req.body;

      // Tìm và thay đổi trạng thái của like thành false
      const existingLike = await Like.findOne({ userId, campaignId });

      if (existingLike && existingLike.status) {
        existingLike.status = false;
        await existingLike.save();
        return res.status(200).json({ message: "Bỏ thích thành công." });
      }

      res.status(400).json({ message: "Bạn chưa thích mục tiêu này." });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server." });
    }
  }
}

module.exports = new LikeController();
