const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Campaign = new Schema(
  {
    ownerAddress: { type: String },
    createdBy: { type: mongoose.Types.ObjectId },
    title: { type: String, required: true },
    description: { type: String, maxLength: 600 },
    content: { type: String },
    image: { type: String },
    videoUrl: { type: String },
    isDelete: { type: Boolean, default: false },
    deadline: { type: Number, required: true },
    target: { type: Number },
    amountCollected: { type: Number, default: 0 },
    tags: { type: Array, default: [] },
    likeCount: { type: Number, default: 0 },
    slug: { type: String, slug: "title", unique: true },
    category: { type: String },
    genres: { type: Array, default: [] },
    likedBy: { type: Array, default: [] },
    User: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", Campaign);
