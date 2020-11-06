// DEPENDENCIES
const express = require("express");
const fs = require("fs");
const path = require("path");
const DB = require('./DB')
let database;

// CONFIGURATION
const app = express();
let PORT = process.env.PORT || 8080;

// EXPRESS SETUP
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// LOAD DATABASE
const getDB = async () => {
    database = new DB();
    await database.init('./db/db.json');
    console.log("--> db.json loaded");
    console.log(JSON.stringify(database));
}
getDB();

// ROUTES
app.get("/notes", function (request, response) {
    response.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API
app.get("/api/notes", function (request, response) {
    // Read the db.json file
    console.log("API request made to /api/notes");
    console.log("--> Returning: "+JSON.stringify(database))
    response.json(database.data);
});

app.post("/api/notes", function (request, response) {
    // res.json(data);
    // Add to db.json file
});

app.delete("/api/notes/:id", function (request, response) {
    // res.json(data);
    // Delete from db.json file
});

// CATCH ALL
app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "./public/index.html"));
});

// LISTENER
app.listen(PORT, function () {
    console.log("Server PORT http://localhost:" + PORT);
});
