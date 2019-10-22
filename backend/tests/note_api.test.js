

const mongoose = require('mongoose');
const app = require ('../app');
const supertest = require('supertest');
const Note = require('../models/note');

const api = supertest(app);

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

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});


test('there are four notes', async () => {
  const response = await api.get('/api/notes');

  expect(response.body.length).toBe(initialNotes.length);
});

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes');

  const contents = response.body.map( r => r.content);

  expect(contents).toContain('Browser can execute only Javascript');
});


afterAll( async () => {
  await mongoose.connection.close();
});

beforeEach( async () => {

  //Clear out the database
  await Note.deleteMany({});

  //Populate the database
  for (let note of initialNotes)
  {
    let newNote = new Note(note);
    await newNote.save();
  }

});