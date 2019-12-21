
const   Comment     = require("../src/models/comment"),
        Campground  = require("../src/models/campground");


//All middleware goes here
var middlewareObj = {};

//Check if a user is logged in
middlewareObj.isLoggedIn = function(req,res,next) {
  if (req.isAuthenticated())
  {
    return next();
  }
  req.flash("error", "User Must Be Logged In");
  res.redirect("/login");
}

//Check if the user is the owner/creator of the campground
middlewareObj.checkCampgroundOwnership = async function(req,res,next) {

  let campgroundUID = req.params.id;

  //Look for authentication / logged in
  if (req.isAuthenticated()) {
    try {
      //Lookup the campground from the database
      let foundCampground = await Campground.findById(campgroundUID);
      if (foundCampground && foundCampground.author.id.equals(req.user._id)) {
        next();
      }
      else {
        req.flash("error", "You dont' have the proper permissions");
        res.redirect("back");
      }
    }
    catch (err) {
      console.log(err);
      req.flash("Campground not found");
      res.redirect("/campgrounds");
    }
  }
  else {
    req.flash("error", "User must log-in first");
    res.redirect("back");
  }
}

//Check if the user is the owner/creator of a commnet
middlewareObj.checkCommentOwndership = async function(req,res,next) {

  let commentUID = req.params.comment_id;

  //Look for authentication / logged in
  if (req.isAuthenticated()) {
    try {
      //Find the comment
      let foundComment = await Comment.findById(commentUID);
      if (foundComment && foundComment.author.id.equals(req.user._id)) {
        next();
      }
      else {
        req.flash("error", "You do not have the proper permissions");
        res.redirect("back");
      }
    }
    catch (err) {
      req.flash("error", "comment not found");
      console.log(err);
      res.redirect("/campgrounds");
    }
  }
  else {
    req.flash("error", "User must be logged in first");
    res.redirect("back");
  }
}


module.exports = middlewareObj;