const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Like = new Schema(
  {
    campaignId: { type: mongoose.Types.ObjectId },
    userId: { type: mongoose.Types.ObjectId },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Like", Like);
