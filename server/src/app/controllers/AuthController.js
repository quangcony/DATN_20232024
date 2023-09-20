// const jwt = require('jsonwebtoken');
const User = require("../models/User");

class AuthController {
  signin(req, res, next) {
    const { email, password } = req.body;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Người dùng khồng tồn tại." });
        }

        if (password !== user.password) {
          return res
            .status(400)
            .json({
              message: "Thông tin mật khẩu khồng chính xác, vui lòng thử lại!",
            });
        }

        // const token = jwt.sign({email: user.email, id: user._id}, 'test', {expiresIn: '1h'})

        res.status(200).json({ data: user });
      })
      .catch(() =>
        res
          .status(500)
          .json({ message: "Người dùng không chính xác, vui lòng thử lại!" })
      );
  }
}

module.exports = new AuthController();
