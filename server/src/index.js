const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const route = require("./app/routes");
const db = require("./app/config/db");
const port = 3000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan("combined"));

// Connect to DB
db.connect();

// Routes init
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
