

//Require Mongoose
const mongoose              = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

//Define the schema
const UserSchema = new mongoose.Schema( {
  username: String,
  password: String
});

//Add the passport/mongoose plugins to the User schema
UserSchema.plugin(passportLocalMongoose);

//export the schema
module.exports = mongoose.model("User", UserSchema);