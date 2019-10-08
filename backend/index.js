
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//Enable body-parser to pull out jason data
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('build'));

let notes = [
  {
    "id": 1,
    "content": "HTML is easy",
    "date": "2019-05-30T17:30:31.098Z",
    "important": false
  },
  {
    "id": 2,
    "content": "Browser can execute only Javascript",
    "date": "2019-05-30T18:39:34.091Z",
    "important": true
  },
  {
    "id": 3,
    "content": "GET and POST are the most important methods of HTTP protocol",
    "date": "2019-05-30T19:20:14.298Z",
    "important": false
  }
];



// app.get('/', (req, res) => {
//   res.send("<h1>Hello World</h1>");
// });

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find( note => note.id === id);
  if (note) {
    res.json(note);
  }
  else
  {
    res.status(404).end();
  }
});

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

  const note = {
    content: req.body.content,
    important: req.body.important || false,
    date: new Date(),
    id: generateId()
  }

  notes.push(note);
  res.json(note);
})

// const port = 3001;
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

