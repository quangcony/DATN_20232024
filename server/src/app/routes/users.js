const express = require("express");
const router = express.Router();

const userController = require("../controllers/UserController");

router.patch("/:id/edit", userController.update);
router.get("/:id", userController.profile);
router.get("/", userController.index);

module.exports = router;
