const Campaign = require("../models/Campaign");
const User = require("../models/User");

class StatisticController {
  //[GET]: /statistics
  async index(req, res) {
    try {
      const projectCount = await Campaign.countDocuments();
      const activeProjectCount = await Campaign.countDocuments({status: 'active'});
      const userCount = await User.countDocuments();
      const partnerCount = await User.countDocuments({verified: true});

      const donationAggregate = await Campaign.aggregate([
        {
          $group: {
            _id: null,
            totalDonation: { $sum: "$amountCollected" }, // Điều này là giả sử có trường donationAmount trong schema
          },
        },
      ]);

      const totalDonation =
        donationAggregate.length > 0 ? donationAggregate[0].totalDonation : 0;
      res.json({ projectCount,activeProjectCount, totalDonation, userCount, partnerCount });
    } catch (error) {
      res.status(200).json({ message: error });
    }
  }
}

module.exports = new StatisticController();
