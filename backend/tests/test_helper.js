const Note = require('../models/note');

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  }
];

const nonExistingId = async () => {
  const newNote = new Note('this will be deleted soon');
  await newNote.save();
  await newNote.remove();

  return newNote._id.toString();
}

const notesInDb = async () => {
  const notes = await Note.find({});
  return notes.map(note => note.toJSON());
}

module.exports = {
  initialNotes, 
  nonExistingId,
  notesInDb
}