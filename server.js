'use strict';

const express = require('express');
const fs = require('fs');
// Constants
const PORT = 8080;

// App
const app = express();
app.get('/', function (req, res) {

    res.send('Hello world\n');
    res.statusCode = 200;



    fs.readFile('app/index.html', 'utf8',function(err,data) {
        if(err) console.log("err");
        console.log(data)
    });
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);