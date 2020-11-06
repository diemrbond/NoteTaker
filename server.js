// DEPENDENCIES
const express = require("express");
const fs = require("fs");
const path = require("path");
const DB = require('./DB')
let database;
let checkChange;

// CONFIGURATION
const app = express();
let PORT = process.env.PORT || 8080;

// EXPRESS SETUP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// FUNCTIONS
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

    checkChange = 0;    

    database.data.forEach(reassignIDs);  

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
    console.log("API request made to GET /api/notes/:"+request.params.id);
    console.log("--> Returning: "+database.data[Number(request.params.id)])
    response.json(database.data[Number(request.params.id)]);
});

app.post("/api/notes", function (request, response) {
    // Add to db.json file
    console.log("API request made to POST /api/notes/");
    console.log("--> Adding: "+request.body);
    let addNote = request.body;
    database.data.push(addNote);
    database.savefile();
});

app.delete("/api/notes/:id", function (request, response) {
    // Delete from db.json file
    console.log("API request made to DELETE /api/notes/:"+request.params.id);
    console.log("--> Deleting: "+request.params.id);
    let deleteNote = Number(request.params.id);
    database.data.splice(deleteNote,1);
    database.data.forEach(reassignIDs);  
    database.savefile();
});

// CATCH ALL
app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "./public/index.html"));
});

// LISTENER
app.listen(PORT, function () {
    console.log("Server PORT http://localhost:" + PORT);
});
