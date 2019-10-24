

const notesRouter = require('express').Router();
const Note = require('../models/note');


//GET - Retrieve all notes
notesRouter.get('/', async (req, res) => {
  
  const notes = await Note.find({});
  res.json( notes.map(note => note.toJSON()));
  
  // Note.find({})
  //   .then(notes => res.send( notes.map(note => note.toJSON())));
});

//GET - Retrieve a single note
notesRouter.get('/:id', async (req, res, next) => {

  try {
    const result = await Note.findById(req.params.id);
    if ( result ) {
      res.json(result.toJSON());
    }
    else {
      res.status(404).end();
    }
  }
  catch (err) {
    next(err);
  }
  

  // Note.findById(req.params.id)
  //   .then(result => {
  //     if ( result ) {
  //       res.send(result.toJSON());
  //     }
  //     else {
  //       res.status(404).end();  
  //     }
  //   })
  //   .catch(err => next(err));
}); // //:id

//DELETE - Delete a single note
notesRouter.delete('/:id', async (req, res, next) => {

  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }
  catch(err) {
    next(err);
  }


  // Note.findByIdAndDelete(req.params.id)
  //   .then(result => {
  //     res.status(204).end();
  //   })
  //   .catch(err => next(err));
});


//POST - Create a new note
notesRouter.post('/', async (req, res, next) => {

  const note = new Note(
    {
      content: req.body.content,
      important: req.body.important || false,
      date: new Date(),
    }
  );

  try {
    const result = await note.save();
    res.json(result.toJSON());

  }
  catch(err) {
    next(err);
  }

  //Save off the note
  // note.save()
  //   .then(result => result.toJSON())
  //   .then(formattedResult => res.json(formattedResult))
  //   .catch(err => next(err));
}); //notesRouter.post

//PUT - Modify a note
notesRouter.put('/:id', async (req, res, next) => {

  //Copy off pertinent data
  const newObj = {
    content: req.body.content,
    important: req.body.important
  };

  try {
    const result = await Note.findByIdAndUpdate(req.params.id, newObj, {new:true});
    res.json(result.toJSON());
  }
  catch(err) {
    errorHandler(err);
  }

  //Update the object based on the id
  // Note.findByIdAndUpdate(req.params.id, newObj, {new:true})
  //   .then(result => res.json(result.toJSON()))
  //   .catch(err => errorHandler(err));

});

module.exports = notesRouter;