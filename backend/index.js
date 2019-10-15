
const config = require ('./utils/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRouter = require('./controllers/notes');

const app = express();

//Enable body-parser to pull out jason data
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('build'));
app.use('/api/notes', notesRouter);





//Setup an unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({error: "unknown endpoint"});
}
app.use(unknownEndpoint);

//Define error handling middleware
const errorHandler = (error, req, res, next) => {
  
  if ( error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({error: "malformed id"})
  }
  if ( error.name === "ValidationError") {
    return res.status(400).send({error: error.message});
  }

  next();
}

app.use(errorHandler);

// const port = 3001;
app.listen(config.PORT, () => {
  console.log(`server listening on port ${config.PORT}`);
});

