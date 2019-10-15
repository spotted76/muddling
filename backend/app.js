
const config = require ('./utils/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

const app = express();


//Establish a connection to the database
mongoose.set('useFindAndModify', false);
mongoose.connect(
  config.MONGODB_URI
  ,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB');
  })
  .catch(err => {
    console.log(
      'Error connecting to MongDB');
  });

//Enable body-parser to pull out jason data
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('build'));

app.use(middleware.requestLogger);
app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// const port = 3001;
// app.listen(config.PORT, () => {
//   console.log(`server listening on port ${config.PORT}`);
// });

module.exports = app;

