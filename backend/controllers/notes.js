

const notesRouter = require('express').Router();
const Note = require('../models/note');


//GET - Retrieve all notes
notesRouter.get('/', (req, res) => {
  Note.find({})
    .then(notes => res.send( notes.map(note => note.toJSON())));
});

//GET - Retrieve a single note
notesRouter.get('/:id', (req, res, next) => {

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
}); // //:id

//DELETE - Delete a single note
notesRouter.delete('/:id', (req, res, next) => {

  Note.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => next(err));
});


//POST - Create a new note
notesRouter.post('/', (req, res, next) => {

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
}); //notesRouter.post

//PUT - Modify a note
notesRouter.put('/:id', (req, res, next) => {

  //Copy off pertinent data
  const newObj = {
    content: req.body.content,
    important: req.body.important
  };

  //Update the object based on the id
  Note.findByIdAndUpdate(req.params.id, newObj, {new:true})
    .then(result => res.json(result.toJSON()))
    .catch(err => errorHandler(err));

});

module.exports = notesRouter;