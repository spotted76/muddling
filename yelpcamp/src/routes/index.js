const express = require("express"),
      passport = require("passport"),
      User = require("../models/user"),
      router  = express.Router();

//Set a route for the main landing page
router.get("/", (req,res) => {
  res.render("landing");
});


//===============================
//AUTH ROUTES
//===============================
router.get("/register", (req, res) => {
  res.render("register");
});

//handle sign up logic
router.post("/register", async (req,res) => {

  try {

    //Create a new user, and register
    let newUser = new User({username: req.body.username});
    let registeredUser = await User.register(newUser, req.body.password);

    //New user added successfully, re-direct
    passport.authenticate("local")(req, res, () => {
      req.flash("success", `User ${req.body.username} created`);
      res.redirect("/campgrounds");
    });

  }
  catch(err)
  {
    req.flash("error", err.message);
    res.redirect("/register");
  }


});

//LOGIN - Show Form
router.get("/login", (req, res) => {
  res.render("login");
});

//LOGIN - Post, actual submitted login
router.post("/login", 
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login", 
    successFlash: "Successful Login", failureFlash: true}));

//LOGOUT Route
router.get("/logout", (req,res) =>
{
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

module.exports = router;