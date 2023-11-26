const User=require("../models/user");

module.exports.rendersingupform=(req, res) => {
    res.render("users/singup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to wanderlust");
            res.redirect("/listings");
        });
        // console.log(registeredUser);

    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/singup");
    }

}

module.exports.renderloginform=(req, res) => {
    res.render("users/login.ejs")
}


module.exports.login= async (req, res) => {
    req.flash("success", "welcome back to wanderlust! You are Logged in!");
    let redirectUrl=res.locals.redirectUrl ||  "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout=(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are successfully Logged out");
        res.redirect("/listings");
    })
};