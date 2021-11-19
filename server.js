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

// // define the first route
// app.get("/hello", function (req, res) {
//     res.send("<h1>Hello World!</h1>")
// })

app.get('/info', (req,res) => {
    res.json(jdata)
});

// start the server listening for requests
let listener = app.listen(process.env.PORT || 3000, 
	() => console.log(`Movie List is running...${listener.address().port}`));
