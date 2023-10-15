const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const User = new Schema(
  {
    orgName: { type: String, required: true },
    location: { type: String },
    email: { type: String },
    password: { type: String },
    website: { type: String },
    description: { type: String },
    image: { type: String },
    fb: { type: String },
    twitter: { type: String },
    rewards: { type: Array, default: [] },
    isDelete: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    noCampaign: { type: Number, default: 0 },
    slug: { type: String, slug: ["firstName", "lastName"], unique: true },
    interests: { type: Array, default: [] },
    liked: { type: Array, default: [] },
    visited: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
