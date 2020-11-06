// DEPENDENCIES
const express = require("express");
const fs = require("fs");
const path = require("path");

// CONFIGURATION
const app = express();
let PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.get("/notes", function (request, response) {
    response.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "./public/index.html"));
});

// API
app.get("/api/notes", function (request, response) {
    // Read the db.json file
    // response.json(data);
});

app.post("/api/notes", function (request, response) {
    // res.json(data);
    // Add to db.json file
});

app.delete("/api/notes/:id", function (request, response) {
    // res.json(data);
    // Delete from db.json file
});

// LISTENER
app.listen(PORT, function () {
    console.log("Server PORT http://localhost:" + PORT);
});
