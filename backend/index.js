
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Note = require("./models/note");

const app = express();

//Enable body-parser to pull out jason data
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('build'));


// let notes = [
//   {
//     "id": 1,
//     "content": "HTML is easy",
//     "date": "2019-05-30T17:30:31.098Z",
//     "important": false
//   },
//   {
//     "id": 2,
//     "content": "Browser can execute only Javascript",
//     "date": "2019-05-30T18:39:34.091Z",
//     "important": true
//   },
//   {
//     "id": 3,
//     "content": "GET and POST are the most important methods of HTTP protocol",
//     "date": "2019-05-30T19:20:14.298Z",
//     "important": false
//   }
// ];

//GET - Retrieve all notes
app.get('/api/notes', (req, res) => {
  Note.find({})
    .then(notes => res.send( notes.map(note => note.toJSON())));
});

//GET - Retrieve a single note
app.get('/api/notes/:id', (req, res, next) => {
  
  Note.findById(req.params.id)
    .then(result => {
      if ( result ) {
        res.send(result.toJSON());
      }
      else {
        res.status(404).end();  
      }
    })
    .catch(err => next(err));
}); // /api/notes/:id

//DELETE - Delete a single note
app.delete('/api/notes/:id', (req, res, next) => {

  Note.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => next(err));
});


//POST - Create a new note
app.post('/api/notes', (req, res, next) => {

  const note = new Note(
    {
      content: req.body.content,
      important: req.body.important || false,
      date: new Date(),
    }
  );

  //Save off the note
  note.save()
    .then(result => result.toJSON())
    .then(formattedResult => res.json(formattedResult))
    .catch(err => next(err));
}); //app.post

//PUT - Modify a note
app.put('/api/notes/:id', (req, res, next) => {

  //Copy off pertinent data
  const newObj = {
   content: req.body.content,
   important: req.body.important
  }

  //Update the object based on the id
  Note.findByIdAndUpdate(req.params.id, newObj, {new:true})
    .then(result => res.json(result.toJSON()))
    .catch(err => errorHandler(err));

});

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
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

