
const mongoose = require("mongoose");

//Create a new schema
const commentSchema = mongoose.Schema( {
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});


//Export the model
module.exports = mongoose.model("Comment", commentSchema);