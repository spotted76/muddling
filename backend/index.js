
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


app.get('/api/notes', (req, res) => {
  //res.json(notes);
  Note.find({})
    .then(notes => res.send( notes.map(note => note.toJSON())));
});

app.get('/api/notes/:id', (req, res) => {
  
  Note.findById(req.params.id)
    .then(result => {
      res.send(result.toJSON());
    })
    .catch(err => {
      res.status(404).end();
    });
}); // /api/notes/:id

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id != id);

  res.status(204).end();
});

const generateId = () => {
  const MaxId = notes.length > 0 
    ? Math.max(...notes.map(n => n.id))
    : 0

  return MaxId + 1;
}

app.post('/api/notes', (req, res) => {

  if ( !req.body.content ) {
    return res.status(400).json({
      error:  'content missing'
    });
  }

  const note = new Note(
    {
      content: req.body.content,
      important: req.body.important || false,
      date: new Date(),
    }
  );

  note.save()
    .then(result => {
      //Now send it back to the server
      res.json(result.toJSON());
    })
    .catch(err => {
      console.log("Error occurred saving note to MongDB");
    })
}); //app.post

// const port = 3001;
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

