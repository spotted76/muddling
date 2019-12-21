
const express = require("express"),
      Campground = require("../models/campground"),
      router  = express.Router(),
      middleware = require("../../middleware");

/**
 * INDEX Route
 */
router.get("/", (req,res) => {

  //Get all campgrounds from the DB
  Campground.find({}, (err, allCampgrounds) => {
    if ( err )
    {
      console.log(err);
    }
    else
    {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  });
});

/**
 * CREATE Route
 */
router.post("/", middleware.isLoggedIn, (req,res) => {

  //Get the data from the form, add it to the campgrounds array
  //Re-Direct back to campgrounds page
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let description = req.body.description;

  //Add author info from the session
  let author = {
    id: req.user.id,
    username: req.user.username
  };

  let newCampground = { name: name, price: price, image: image, description: description, author: author};
 

  //Create a new entry in the database
  Campground.create(newCampground, (err, newlyCreated) => {
    if ( err )
    {
      console.log(err);
    }
    else {
      res.redirect("/campgrounds");
    }
  })
  
});

/**
 * NEW Route
 */
router.get("/new", middleware.isLoggedIn, (req,res) => {
  res.render("campgrounds/new");
});


/**
 * SHOW Route.  Shows information about one specific campground
 */
router.get("/:id", (req,res) => {
  //Find the campground with the provided ID

  Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground) => {
    if (!err) {
      res.render("campgrounds/show", { campground : foundCampground });
    }
    else {
      console.log(err);
    }
  });
  
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, async (req, res) => {

  let campgroundUID = req.params.id;

    try {
      //Lookup the campground from the database
      let foundCampground = await Campground.findById(campgroundUID);
      res.render("campgrounds/edit", { campground: foundCampground });
    }
    catch (err) {
      console.log(err);
      res.redirect("back");
    }  
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, async (req, res) => {

  try {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${req.params.id}`);
  }
  catch(err)
  {
    res.redirect("/");
  }

  //find and update the correct campground
  //Redirect back to show page
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  try {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  }
  catch(err) {
    console.log(err);
    res.redirect("/campgrounds");
  }
});


// Export all the routes
module.exports = router;
