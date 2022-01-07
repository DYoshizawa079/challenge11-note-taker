const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3002;
const app = express();

const notes = require('./db/db');

// Express Middleware
app.use(express.urlencoded({ extended: true })); //"{extended: true}" tells that there may be arrays nested in the data
// parse incoming JSON data
app.use(express.json());

// Needed to ensure that static files (i.e: stylesheets) are loaded from the correct folder
app.use(express.static('public'));


function createNewNote(body) { 
    console.log(body);

    const note = body;
    notes.push(note);

    // Writes the new note to the JSON file
    fs.writeFileSync(
        // _dirname represents the dire of the file we execute the code in
        path.join(__dirname, './db/db.json'),
        //
        JSON.stringify(notes, null, 2)
    );
  
    // return finished code to post route for response
    return note;
}

// Process GET request for list of notes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// Process POST request
app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content will be
    // data received is processed by middleware (see further up code) before it's processed as req.body
    console.log(req.body);
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