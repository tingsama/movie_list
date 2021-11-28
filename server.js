// create an express app
const express = require("express")
const app = express()

const path = require("path")
const fs = require('fs')
const bodyParser = require('body-parser')
let jdata = JSON.parse(fs.readFileSync('public/movie.json'));

// use the express-static middleware
app.use(express.static("public"));
app.use(express.json());

app.get('/info', (req,res) => {
    res.json(jdata)
});

app.post("/add",(req, res) => {
    console.log(">>post ...", req.body);
    req_body = req.body;
    addSomething(req_body.index, req_body.like) 
    res.sendStatus(200)
});

const addSomething = (index, like) => {
    changed_term = jdata.data[index];
    changed_term.Like = like;
	console.log(">>>add ...      ", changed_term)
}

// start the server listening for requests
let listener = app.listen(process.env.PORT || 3000, 
	() => console.log(`Movie List is running...${listener.address().port}`));
