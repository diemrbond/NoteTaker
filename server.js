// DEPENDENCIES
const express = require("express");
const path = require("path");
const DB = require('./DB')

// VARIABLES
let database;
let checkChange;

// CONFIGURATION
const app = express();
let PORT = process.env.PORT || 8080;

// EXPRESS SETUP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// FUNCTION TO REASSIGN ID's AFTER ADD, DELETION, ETC
function reassignIDs(item, index){
    if (item.id == undefined){
        item.id = index;
        console.log(`ID didn't exist for ${index}, adding ${item.id}`);
        checkChange++
    }
    else {
        item.id = index;
    }
}

// LOAD DATABASE
const getDB = async () => {    
    database = new DB();
    await database.init('./db/db.json');
    console.log("--> db.json loaded");

    // CHECK IF ANY CHANGES ARE MADE WHEN REASSIGNING ID's
    checkChange = 0;    

    // LOOP THROUGH DATA AND CHECK FOR AN ID
    database.data.forEach(reassignIDs);  

    // SAVE FILE ONCE, AS OTHERWISE CAUSES NEVERENDING LOOP WITH NODEMON
    if (checkChange > 0){
        console.log("--> Had to add an ID, saving change to db.json");
        database.savefile();
    }
}
getDB();

// ROUTES
app.get("/notes", function (request, response) {
    response.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API
app.get("/api/notes", function (request, response) {
    // Read the db.json file
    console.log("API request made to GET /api/notes");
    console.log("--> Returning: "+database.data)
    response.json(database.data);
});

app.get("/api/notes/:id", function (request, response) {
    // Read specific id
    let selectedNote = Number(request.params.id);
    console.log(`API request made to GET /api/notes/:${request.params.id}`);
    console.log(`--> Returning: ${database.data[selectedNote]}`)
    response.json(database.data[selectedNote]);
});

app.post("/api/notes", function (request, response) {
    // Add to db.json file
    console.log("API request made to POST /api/notes/");
    let addNote = request.body;
    console.log(`--> Adding: ${addNote}`);
    database.data.push(addNote);
    database.data.forEach(reassignIDs); 
    database.savefile();
    response.json(database.data);
});

app.delete("/api/notes/:id", function (request, response) {
    // Delete from db.json file
    console.log(`API request made to DELETE /api/notes/:${request.params.id}`);
    let deleteNote = Number(request.params.id);
    console.log(`--> Deleting: ${deleteNote}`);
    database.data.splice(deleteNote,1);
    database.data.forEach(reassignIDs);  
    database.savefile();
    response.json(database.data);
});

// CATCH ALL
app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "./public/index.html"));
});

// LISTENER
app.listen(PORT, function () {
    console.log("Server PORT http://localhost:" + PORT);
});
