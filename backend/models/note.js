const mongoose = require('mongoose');

//Establish a connection to the database
const MONGODB_URI = process.env.MONGDB_URI;
mongoose.connect(
  MONGODB_URI
  ,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => {
    console.log("connected to MongoDB")
  })
  .catch(err => {
    console.log(
    "Error connecting to MongDB")
  });

//Define the schema & model for the Note
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

//Export Note
module.exports = mongoose.model('Note', noteSchema);