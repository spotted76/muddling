
//Include dependencies
const express       = require("express"),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      flash         = require("connect-flash");
      passport      = require("passport"),
      localStrategy = require("passport-local"),
      methodOverride = require("method-override");

// Import schemas
const Campground = require("./models/campground"),
      Comment    = require("./models/comment"),
      User       = require("./models/user");

//Import functions
const seedDB = require("./seeds");


//Routes
const commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campground"),
      indexRoutes = require("./routes/index");

//seedDB();

//connect to the Mongo instance
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useFindAndModify: false}).then(
  () => {
    console.log("Successfully connected to the mongdb instnace");
    //Start the web server
    let port = 3000;
    app.listen(port, () => {
    console.log(`Yelp Camp Server Has Started On Port:  ${port}`);

})
  }, 
  err => { 
    console.log("Error, unable to connect to mon")
  }
)




//Create main app, and set the view enging for EJS
const app = express();
app.set("view engine", "ejs");

//Use body-parser to parse post requests
app.use(bodyParser.urlencoded({extended: true}));

//Add public / static routes
app.use(express.static("./public"));

//Passport configuration
app.use(require("express-session")({
  secret:  "Charlie is the best dog ever",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());

//Create middleware for setting the current user
app.use((req,res,next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//Use Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Setup passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

