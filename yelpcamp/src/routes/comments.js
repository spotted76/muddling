const express = require("express"),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleware = require("../../middleware"),
      router = express.Router({mergeParams: true});

// Comments NEW - Nested route
router.get("/new", middleware.isLoggedIn, async (req, res, next) => {

  try {
    let campground = await Campground.findById(req.params.id);
    res.render("comments/new", {campground : campground});
  }
  catch (err) {
    console.log(err);
    next(err);
  }

});

// Comments CREATE - Nested route
router.post("/", middleware.isLoggedIn, async (req, res) => {

  //Pull the request from the body & create a new comment
  try {
    
    //Create the comment from the passed object in the body
    let rxComment = req.body.comment
    let comment = await Comment.create(rxComment);

    //Also need to look up the user informaton for the comment
    comment.author.username = req.user.username;
    comment.author.id = req.user._id; 
    comment.save();


    //Now go pull the campground, and add the comment to the campground
    let campground = await Campground.findById(req.params.id);
    campground.comments.push(comment);
    await campground.save();

    //Re-direct back to the show page
    req.flash("success", "New Comment Added");
    res.redirect(`/campgrounds/${req.params.id}`);

  }
  catch(err)
  {
    req.flash("error", "Failed to create comment");
    console.log(err);
    res.redirect(`/campgrounds/${req.params.id}`);
  }

});

//EDIT page for a comment
router.get("/:comment_id/edit", middleware.checkCommentOwndership, async (req, res) => {

  try {
    //Retrieve the comment
    let comment = await Comment.findById(req.params.comment_id);
    if ( !comment ) {
      throw new Error("Unable to find comment with passed ID");
    }
    res.render("comments/edit", {
      campground_id: req.params.id,
      comment: comment});  
  }
  catch(err)
  {
    req.flash("error", "Unable to retrieve comment");
    console.log(err);
    res.redirect(`/campgrounds/${req.params.id}`)
  }

});

//UPDATE page
router.put("/:comment_id", middleware.checkCommentOwndership, async (req, res) => {

  try {
    //Need to do a find by ID & update
    await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
    
    //Re-direct back to the show page
    res.redirect(`/campgrounds/${req.params.id}`);
  }
  catch(err)
  {
    console.log(err);
    res.redirect(`/campgrounds/${req.params.id}`);
  }

});

//Delete / Destroy route
router.delete("/:comment_id", middleware.checkCommentOwndership, async (req, res) => {
  
  try {
    if (! (await Comment.findByIdAndDelete(req.params.comment_id)) ) {
      throw new Error("Failed to delete user comment");
    }
    req.flash("success", "Comment Deleted");
    res.redirect(`/campgrounds/${req.params.id}`);
  }
  catch (err )
  {
    console.log("err");
    res.redirect("back");
  }
});

module.exports = router;