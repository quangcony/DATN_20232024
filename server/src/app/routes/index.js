const campaignsRouter = require("./campaigns");
const usersRouter = require("./users");
const authRouter = require("./auth");
const commentRouter = require("./comments");
const likeRouter = require("./likes");

function route(app) {
  app.use("/campaigns", campaignsRouter);
  app.use("/users", usersRouter);
  app.use("/auth", authRouter);
  app.use("/comments", commentRouter);
  app.use("/likes", likeRouter);
}

module.exports = route;
