
import React, {useState} from 'react'
import Note from './components/note'

//App module
const App = ({notes : passedNotes}) => {

  const [notes, setNotes] = useState(passedNotes);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);

  const notesToShow = showAll ? notes : 
    notes.filter( (note) => note.important === true);


  //Map each note object to a Note component
  const rows = () => 
    notesToShow.map( note => 
    <Note
      key={note.id}
      note={note} /> 
  ); 

  
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const addNote = (event) => {
    event.preventDefault();
    const noteObject =   {
      id: notes.length + 1,
      content: newNote,
      date: '2019-05-30T17:30:31.098Z',
      important: Math.random() > 0.5
    }

    setNotes(notes.concat(noteObject));
    setNewNote('');
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