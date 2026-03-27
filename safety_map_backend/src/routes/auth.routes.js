const express    = require("express");
const router     = express.Router();
const controller = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");

router.post("/signup",          controller.signup);
router.post("/login",           controller.login);
router.get( "/me",   protect,   controller.getMe);
router.patch("/me",  protect,   controller.updateProfile);

const { signup } = require("../controllers/auth.controller");

router.post("/signup", signup);

module.exports = router;