
//Setup an unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};


//Define error handling middleware
const errorHandler = (error, req, res, next) => {

  if ( error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformed id' });
  }
  if ( error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  next();
};

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger
};