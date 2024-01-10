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
    status: { type: String, default: 'pending' },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

Campaign.index({ location: '2dsphere' });

module.exports = mongoose.model("Campaign", Campaign);
