

const mongoose = require('mongoose');
const app = require ('../app');
const supertest = require('supertest');
const Note = require('../models/note');
const helper = require('./test_helper');

const api = supertest(app);


test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});


test('there are two notes', async () => {
  const response = await api.get('/api/notes');

  expect(response.body.length).toBe(helper.initialNotes.length);
});

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map( r => r.content);

  expect(contents).toContain('Browser can execute only Javascript');
});

test('a valid note can be added', async () => {

  //Declare a new note to add
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // const response = await api.get('/api/notes');

  // const contents = response.body.map(res => res.content);

  const notesAtEnd = await helper.notesInDb();
  expect(notesAtEnd.length).toBe(helper.initialNotes.length + 1);

  const contents = notesAtEnd.map(note => note.content);
  expect(contents).toContain(
    'async/await simplifies making async calls');
    
});

test('note without content is not added', async() => {
  const newNote = {
    important: true,
  };

  const result = await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)
    .expect('Content-Type', /application\/json/);

    //const response = await api.get('/api/notes');
    const notesAtEnd = await helper.notesInDb();

    expect(notesAtEnd.length).toBe(helper.initialNotes.length);

});

test('a specific note can be viewed', async () => {

  const notes = await helper.notesInDb();
  const noteToView = notes[0];

  const result = await api.get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(result.body.content).toEqual(noteToView.content);

});

test('a note can be deleted', async () => {

  const notesAtStart = await helper.notesInDb();
  const noteToDelete = notesAtStart[0];

  const result = await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204);

  const notesAtEnd = await helper.notesInDb();

  expect(notesAtEnd.length).toBe(notesAtStart.length - 1);

  const contents = notesAtEnd.map(note => note.content);
  expect(contents).not.toContain(noteToDelete.content);

});


afterAll( async () => {
  await mongoose.connection.close();
});

beforeEach( async () => {

  //Clear out the database
  await Note.deleteMany({});

  //Populate the database
  for (let note of helper.initialNotes)
  {
    let newNote = new Note(note);
    await newNote.save();
  }

});