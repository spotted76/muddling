
import React, {useState, useEffect} from 'react'
import Note from './components/note'
import noteService from './services/notes'

//App module
const App = () => {

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);

   //Use an effect to retrieve json data
  useEffect(() => {
      noteService
        .getAll()
        .then(initialNotes => {
          setNotes(initialNotes)
        });
    }, []);
  


  // Show either all notes, or filtered notes
  const notesToShow = showAll ? notes : 
    notes.filter( (note) => note.important === true);

  const toggleImportance = id => {
    const note = notes.find(note => note.id === id);

    //Make a new note by copying the old, then make aput request
    const changedNote = {...note, important : !note.important };
    noteService
      .update(id, changedNote)
      .then(returnedNote =>
        setNotes(
          notes.map(note => note.id !== id ? note : returnedNote))
      )
      .catch(error => {
        alert(`The note ${note.content} was already deleted from the server`);
        setNotes(notes.filter(note => note.id !== id));
      })
  }

  //Map each note object to a Note component
  const rows = () => 
    notesToShow.map( note => 
    <Note
      key={note.id}
      note={note}
      toggleImportance = {() => toggleImportance(note.id)} /> 
  ); 

  
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const addNote = (event) => {
    event.preventDefault();
    const noteObject =   {
      content: newNote,
      date: '2019-05-30T17:30:31.098Z',
      important: Math.random() > 0.5
    }

    noteService.create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      });
    
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={
          () => setShowAll(!showAll)
        }>show {showAll ? 'important' : 'all' }</button>
      </div>
      <ul>
        {rows()}
      </ul>
      <form onSubmit={addNote}>
        <input value = {newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
    </div>
  );

}

export default App;