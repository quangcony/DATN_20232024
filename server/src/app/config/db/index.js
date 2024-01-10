const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://dnq1310:zLPvugXDFjakT53X@cluster0.kx0evck.mongodb.net/crowdfunding_dev");
    console.log("Connect Succesfully!");
  } catch (error) {
    console.log("Connect Failure!!");
  }
};

module.exports = { connect };
