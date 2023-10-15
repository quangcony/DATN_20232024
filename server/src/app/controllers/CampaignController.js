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

  // [GET]: /campaigns/:userId
  getCampaignsByUser(req, res, next) {
    Campaign.find({ createdBy: req.params.userId })
      .then((campaigns) => res.json(campaigns))
      .catch(next);
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
}

module.exports = new CampaignController();
