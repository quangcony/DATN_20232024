const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crowdfunding_dev");
    console.log("Connect Succesfully!");
  } catch (error) {
    console.log("Connect Failure!!");
  }
};

module.exports = { connect };
