const config = require('../utils/config');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

//Establish a connection to the database
mongoose.connect(
  config.MONGODB_URI
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
  content: { 
   type: String,
   minlength: 5,
   required: true
  },
  date: {
   type: Date,
   required: true
  },
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