
const config = require ('./utils/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const app = express();


//Establish a connection to the database
mongoose.set('useFindAndModify', false);
mongoose.connect(
  config.MONGODB_URI
  ,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then( () => {
    logger.info('connected to MongoDB');
  })
  .catch(err => {
    logger.error(
      'Error connecting to MongDB', err);
  });

//Enable body-parser to pull out jason data
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('build'));

app.use(middleware.requestLogger);
app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;