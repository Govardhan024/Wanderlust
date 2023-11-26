const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../middleware.js");
const usercontroller=require("../controllers/user.js");

router.route("/singup")
.get(usercontroller.rendersingupform)
.post(wrapAsync(usercontroller.signup));

router.route("/login")
.get(usercontroller.renderloginform )
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),usercontroller.login);


router.get("/logout",usercontroller.logout);

module.exports = router