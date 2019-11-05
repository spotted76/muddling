
import React, {useState, useEffect} from 'react'
import Note from './components/note'
import noteService from './services/notes'
import loginService from './services/login'

import './index.css'

//Create a component for displaying an error
const Notification = ({message}) => {
  if ( message === null) {
    return null;
  }

  return (
    <div className="error">
      {message}
    </div>
  );
}

const Footer = () => {

  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
        <em>Note app, Department of Computer Science, University of Helsinki 2019</em>
    </div>
  );
}

//App module
const App = () => {

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

   //Use an effect to retrieve json data
  useEffect(() => {
      noteService
        .getAll()
        .then(initialNotes => {
          setNotes(initialNotes)
        });
    }, []);

    useEffect(() => {

      const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser');
      if ( loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        setUser(user);
        noteService.setToken(user);
      }

    },[]);
  


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
        setErrorMessage(`The note ${note.content} was already deleted from the server`);
        setTimeout(() => {setErrorMessage(null)}, 5000);
        
        setNotes(notes.filter(note => note.id !== id));
      });
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

  const onLogin = async (event) => {
    event.preventDefault();
    
    try {
      const authUser = await loginService.login({username, password});

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(authUser));

      noteService.setToken(authUser.token);
      setUser(authUser);
      setUsername('');
      setPassword('');
    }
    catch(error) {
      setErrorMessage('Wrong Credentials');
      setTimeout( () => {
        setErrorMessage(null)
      }, 5000);
    }

  }

  const loginForm = () => (
    <form onSubmit={onLogin}>
        <div>
          username 
          <input
            type = "text"
            value = {username}
            onChange = {({target}) => setUsername(target.value)}
          />
        </div>
        <div>
          password 
          <input 
            type="password"
            value = {password}
            onChange = {({target}) => setPassword(target.value)}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
  );

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value = {newNote} onChange={handleNoteChange}/>
      <button type="submit">save</button>
    </form>
  );

  return (
    <div>
      <h1>Notes</h1>

      <Notification message={errorMessage} />

      <h2>Login</h2>


      {user === null 
        ? loginForm() 
        : <div>
            <p>{user.name} logged in</p>
            {noteForm()}
          </div>
      }
      

      <div>
        <button onClick={
          () => setShowAll(!showAll)
        }>show {showAll ? 'important' : 'all' }</button>
      </div>


      <ul>
        {rows()}
      </ul>
      <Footer />
    </div>
  );

}

export default App;