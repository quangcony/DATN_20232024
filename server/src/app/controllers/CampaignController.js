const Campaign = require("../models/Campaign");
const User = require("../models/User");
const { spawn } = require("child_process");
const Like = require("../models/Like");

class CampaignController {
  //[GET]: /campaigns
  index(req, res, next) {
    Campaign.find({status: 'active'})
      .populate('user')
      .sort({ likeCount: -1 })
      .then((campaign) => res.json(campaign))
      .catch(next)
  }

  getFeaturedCampaign(req, res, next) {
    Campaign.findOne({status: 'active'})
      .populate('user')
      .sort({ likeCount: -1, createdAt: -1 })
      .then((campaign) => res.json(campaign))
      .catch(next)
  }

  getCampaignsByTag(req, res, next) {
    Campaign.find({ tags: req.params.hashtag, status: 'active' })
      .populate("user")
      .then((campaigns) => res.json(campaigns))
      .catch(next);
  }

  getCampaignsByQuery(req, res, next) {
    Campaign.find(req.query)
      .populate('user')
      .then((campaigns) => res.json(campaigns))
      .catch(next);
  }

  async getCampaignsByGenre(req, res) {
    const patterns = req.query.genre.split("$");
    try {
      const data = await Campaign.find({ genres: { $in: patterns }, status: 'active' }).populate(
        "user"
      );
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server." });
    }
  }

  async getCampaignsByNearyou(req, res) {
    const { lat, lon } = req.body;
    const distance = 1;
    const unitValue = 100000; //100 km

    try {
      const data = await Campaign.aggregate([
        
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lon, lat],
            },

            maxDistance: distance * unitValue,
            distanceField: "distance",
            spherical: true,
          },
          
        },

        {
          $match: {
            status: 'active', 
          },
        },

        {
          $lookup: {
            from: 'users', // Tên của mô hình tham chiếu
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },

        {
          $sort: {
            distance: 1,
          },
        },
        { $limit: 5 },
      ]);

      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server." });
    }
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
    User.findOne({ slug: req.params.slug})
      .then((user) => {
        if (user) {
          const userId = user._id;
          // console.log(user);
          Campaign.find({ user: userId, status: 'active' })
            .then((campaigns) => res.json(campaigns))
            .catch(next);
        }
      })
      .catch((e) => res.json({ message: "User not found!" }));
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
      const campaigns = await Campaign.find({status: 'active'}).populate("user");
      const users = await User.find({});
      const interactions = await Like.find({});

      const args = [];
      const dataSets = [userId, campaigns, users, interactions];

      const pythonProcess = spawn("python", [
        "./src/app/services/recommender_v3.py",
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
        try {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // console.log("Raw data received from Python:", data.toString());
          // Handle the error or data accordingly
        }
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python Script: ${data}`);
        // res.json({ errorMessage: data });
      });

      pythonProcess.on("close", (code) => {
        console.log(`Python Script Exited with Code ${code}`);
      });
    }
  };

  // [GET]: /campaigns/search/:keyword
  searchRecommend = async (req, res, next) => {
    const queryString = req.query.keyword;

    if (queryString) {
      const campaigns = await Campaign.find({status: 'active'}).populate("user")

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
        try {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // console.log("Raw data received from Python:", data.toString());
          // Handle the error or data accordingly
        }
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python Script: ${data}`);
        // res.json({ errorMessage: data });
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
      const campaigns = await Campaign.find({status: 'active'}).populate("user");

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
        try {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          // console.log("Raw data received from Python:", data.toString());
          // Handle the error or data accordingly
        }
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Error from Python Script: ${data}`);
        // res.json({ errorMessage: data });
      });

      pythonProcess.on("close", (code) => {
        console.log(`Python Script Exited with Code ${code}`);
      });
    }
  };
}

module.exports = new CampaignController();
