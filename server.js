//dependencies

const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const app = express();
const PORT = 8900;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

getJSON = () => {
  // reads the db.json file
  return readFileAsync("./db/db.json", "utf8")
    .then((data) => JSON.parse(data))
    .catch(function (err) {
      console.log(err);
    });
};

//The application should have a `db.json` file on the backend that will be used to store and retrieve notes using the `fs` module.
writetoFile = (notes) => {
  writeFileAsync("./db/db.json", JSON.stringify(notes))
    .then(() => console.log("Complete"))
    .catch(function (err) {
      console.log(err);
    });
};

//creating a unique ID
mapId = (arr) => {
  return arr.map((val, index) => {
    val.id = index + 1;
    return val;
  });
};

//GET `/notes` - Should return the `notes.html` file.
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", async (req, res) => {
  const noteArr = await getJSON();
  res.json(noteArr);
});

//POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", async (req, res) => {
  const noteArr = await getJSON();
  const newNote = req.body;
  noteArr.push(newNote);
  const noteId = mapId(noteArr);
  writetoFile(noteArr);
  return res.json(newNote);
});

//DELETE `/api/notes/:id` - Should receive a query parameter containing the id of a note to delete. This means you'll need to find a way to give each note a unique `id` when it's saved. In order to delete a note, you'll need to read all notes from the `db.json` file, remove the note with the given `id` property, and then rewrite the notes to the `db.json` file.
app.delete("/api/notes/:id", async (req, res) => {
  const noteArr = await getJSON();
  const deleteId = req.params.id;

  for (let i = 0; i < noteArr.length; i++) {
    if (deleteId == noteArr[i].id) {
      noteArr.splice(i, 1);
    }
  }
  writetoFile(noteArr);
  res.send(200);
});

//GET `*` - Should return the `index.html` file
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// starting server and logging when server has started
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
