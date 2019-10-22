
const logger = require('../utils/logger');


//Setup an unknown endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};


//Define error handling middleware
const errorHandler = (error, req, res, next) => {

  logger.error(error.message);

  if ( error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformed id' });
  }
  if ( error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  next();
};

const requestLogger = (request, response, next) => {
  logger.info('Body:  ', request.body)
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('---')
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  requestLogger
};