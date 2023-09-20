const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    message: { type: String },
    campaignId: { type: mongoose.Types.ObjectId },
    userId: { type: mongoose.Types.ObjectId },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", Comment);
