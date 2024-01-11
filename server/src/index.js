const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const route = require("./app/routes");
const db = require("./app/config/db");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const port = 3000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan("combined"));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Connect to DB
db.connect();

// Routes init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
