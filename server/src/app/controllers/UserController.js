const User = require("../models/User");

class UserController {
  //[GET]: /users
  index(req, res, next) {
    User.find({})
      .then((users) => res.json(users))
      .catch(next);
  }

  //[GET]: /users/:id
  profile(req, res, next) {
    User.findById(req.params.id)
      .then((user) => res.json(user))
      .catch(next);
  }

  // [PATCH]: /users/:id/edit
  update(req, res, next) {
    User.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.json({ message: "Cập nhật người dùng thành công!" }))
      .catch(next);
  }
}

module.exports = new UserController();
