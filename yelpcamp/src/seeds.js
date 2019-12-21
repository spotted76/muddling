
const mongoose = require("mongoose");
const Campground = require("./models/campground")
const Comment = require("./models/comment");


async function seedDb()
{

  //Declare the seed elements
  let campgrounds = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
  ];


  try {
    //Remove all camgrounds & comments
    let cgResult =  Campground.deleteMany({});
    let commResult = Comment.deleteMany({});

    //Wait until it's complete
    await Promise.all([cgResult, commResult]);
    console.log("All camgrpunds & comments deleted");
    
  }
  catch(err)
  {
    console.log("Error removing campgrounds/comments");
    console.log(err);
  }

  //Now loop through the campgrounds, & create each one
  for( const camp of campgrounds )
  {
    try {
      let newCG = await Campground.create(camp);
      
      //Now that the camground has been created, create a new comment
      let comment = await Comment.create({
        text:  "This place is great, but it could use some Wi-Fi",
        author:  "Homer"
      });

      //Now associate the comment with the campground instance
      newCG.comments.push(comment);
      newCG.save();
    }
    catch(err)
    {
      console.log("Error creating campground");
      console.log(err);
    }
  }

}




module.exports = seedDb;