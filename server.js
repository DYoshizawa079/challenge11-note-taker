const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3002;
const app = express();

const notes = require('./db/db');

// Express Middleware
app.use(express.urlencoded({ extended: true })); 
// Parse incoming JSON data
app.use(express.json());

// Needed to ensure that static files (i.e: stylesheets) are loaded from the correct folder
app.use(express.static('public'));

function createNewNote(body) { 

    const note = body;
    notes.push(note);

    // Writes the new note to the JSON file
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notes, null, 2)
    );
  
    // Return the finished code to POST route for response
    return note;
}

// Process GET request for list of notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// Process POST request
app.post('/api/notes', (req, res) => {

    // Set the ID of note (Uses the time that the note was generated to maket the ID)
    const noteID = Date.now();
    req.body.id = noteID;

    createNewNote(req.body);
    res.json(req.body);

});

// Serve HTML content
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Tell express which port to listen to
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
})