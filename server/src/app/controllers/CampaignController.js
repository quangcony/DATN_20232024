const Campaign = require("../models/Campaign");
const User = require("../models/User");
const { spawn } = require("child_process");

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
      .populate("User")
      .sort({ likeCount: -1 })
      .then((campaign) => res.json(campaign))
      .catch(next);
  }

  getCampaignsByTag(req, res, next) {
    Campaign.find({ tags: req.params.hashtag })
      .populate("User")
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

  // [GET]: /campaigns/getCampaignsByUser/:userId
  getCampaignsByUser(req, res, next) {
    const user = User.findOne({ slug: req.params.slug }).exec();
    if (user) {
      const userId = user._id;
      Campaign.find({ createdBy: userId })
        .then((campaigns) => res.json(campaigns))
        .catch(next);
    }
  }

  // [PATCH]: /campaigns/:campaignId/like
  async like(req, res, next) {
    const { campaignId } = req.params;
    const { userId } = req.body;

    try {
      const campaign = await Campaign.findById(campaignId);
      const user = await User.findById(userId);

      if (!campaign || !user) {
        return res
          .status(404)
          .json({ message: "Chiến dịch hoặc người dùng không tồn tại." });
      }

      if (campaign.likedBy.includes(userId)) {
        return res
          .status(400)
          .json({ message: "Bạn đã thích chiến dịch này." });
      }

      campaign.likedBy.push(userId);
      campaign.likeCount += 1;

      await campaign.save();
      res.json({
        message: `Cảm ơn bạn đã yêu thích chiến dịch cùa chúng tôi.`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server." });
    }
  }

  // [PATCH]: /campaigns/:campaignId/unlike
  async unlike(req, res, next) {
    const { campaignId } = req.params;
    const { userId } = req.body;

    try {
      const campaign = await Campaign.findById(campaignId);
      const user = await User.findById(userId);

      if (!campaign || !user) {
        return res
          .status(404)
          .json({ message: "Chiến dịch hoặc người dùng không tồn tại." });
      }

      if (!campaign.likedBy.includes(userId)) {
        return res
          .status(400)
          .json({ message: "Bạn đã thích chiến dịch này rồi." });
      }

      campaign.likedBy = campaign.likedBy.filter((like) => like !== userId);
      campaign.likeCount -= 1;

      await campaign.save();

      res.json({ message: `Bạn đã bỏ thích chiến dịch này.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server." });
    }
  }

  // [GET]: /campaigns/recommender/:userId
  recommender = async (req, res, next) => {
    const userId = req.params.userId;

    if (userId) {
      const campaigns = await Campaign.find({}).populate("User");
      const users = await User.find({});

      const args = [];
      const dataSets = [userId, campaigns, users];

      const pythonProcess = spawn("python", [
        "./src/app/services/recommender.py",
        ...args,
      ]);

      // Send the data to the Python script through standard input (stdin)
      dataSets.forEach((data) => {
        // Serialize the data as JSON
        const dataSerialized = JSON.stringify(data);
        pythonProcess.stdin.write(dataSerialized + "\n"); // Add '\n' to separate data sets
      });
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (data) => {
        res.json(JSON.parse(data));
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python Script: ${data}`);
        res.json({ errorMessage: data });
      });

      pythonProcess.on("close", (code) => {
        console.log(`Python Script Exited with Code ${code}`);
      });
    }
  };

  // [GET]: /campaigns/search/:keyword
  searchRecommend = async (req, res, next) => {
    const queryString = req.query.keyword;

    console.log("querystring::", queryString);

    if (queryString) {
      const campaigns = await Campaign.find({}).populate("User");

      const args = [];
      const dataSets = [queryString, campaigns];

      const pythonProcess = spawn("python", [
        "./src/app/services/recommender_search.py",
        ...args,
      ]);

      // Send the data to the Python script through standard input (stdin)
      dataSets.forEach((data) => {
        // Serialize the data as JSON
        const dataSerialized = JSON.stringify(data);
        pythonProcess.stdin.write(dataSerialized + "\n"); // Add '\n' to separate data sets
      });
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (data) => {
        res.json(JSON.parse(data));
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python Script: ${data}`);
        res.json({ errorMessage: data });
      });

      pythonProcess.on("close", (code) => {
        console.log(`Python Script Exited with Code ${code}`);
      });
    }
  };

  // [GET]: /campaigns/related/:campaignId
  relatedRecommend = async (req, res, next) => {
    const campaignId = req.params.campaignId;

    if (campaignId) {
      const campaigns = await Campaign.find({}).populate("User");

      const args = [];
      const dataSets = [campaignId, campaigns];

      const pythonProcess = spawn("python", [
        "./src/app/services/recommender_by_item.py",
        ...args,
      ]);

      // Send the data to the Python script through standard input (stdin)
      dataSets.forEach((data) => {
        // Serialize the data as JSON
        const dataSerialized = JSON.stringify(data);
        pythonProcess.stdin.write(dataSerialized + "\n"); // Add '\n' to separate data sets
      });
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (data) => {
        res.json(JSON.parse(data));
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python Script: ${data}`);
        res.json({ errorMessage: data });
      });

      pythonProcess.on("close", (code) => {
        console.log(`Python Script Exited with Code ${code}`);
      });
    }
  };
}

module.exports = new CampaignController();
