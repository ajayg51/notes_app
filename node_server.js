const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();
app.use(cors())

const jsonParser = bodyParser.json()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ajay_db'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/get-notes", (req, res) => {
    console.log("Home page");
    let rowList = [];

    const query = `SELECT * FROM Notes`
    connection.query(query, (err, resultSet, fields) => {
        if (err) {
            console.log("Error while select * from table", err)
            return;
        }
        console.log(resultSet);

        rowList = resultSet.map(item => {
            return {
                id: item.id,
                note_title: item.note_title,
                note_desc: item.note_desc,
                note_timestamp: item.note_timestamp,
            }
        });

        console.log(rowList)

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.send(rowList)
    });


})

app.post("/post-note", jsonParser, (req, res) => {
    console.log("post-api called")
    console.log(req.body);
    const noteTitle = req.body["note_title"]
    const noteDesc = req.body["note_desc"]
    const noteTimestamp = req.body["note_timestamp"]

    console.log(noteTitle);
    console.log(noteDesc);
    console.log(noteTimestamp)

    const query = `INSERT INTO Notes(note_title,note_desc,note_timestamp)
    VALUES("${noteTitle}","${noteDesc}","${noteTimestamp}")`

    connection.query(query);
    res.send({
        msg: "Successfully added data in db"
    });
})


app.delete("/delete-note", jsonParser, (req, res) => {
    console.log("delete-api called")
    console.log(req.body);
    const noteId = req.body["id"]
    console.log(noteId);

    const query = `DELETE FROM Notes where id=${noteId}`
    connection.query(query, (err) => {
        if (err) {
            console.log("delete - api Error", err);
            res.send({
                msg: "Something went wrong!"
            });
            return;
        }
        res.send({
            msg: "Deleted note successfully"
        });
    });


})
