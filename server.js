'use strict';

const express = require('express');
const fs = require('fs');
// Constants
const PORT = 8080;

// App
const app = express();
app.get('/stories', function (req, res) {


    fs.readdir('./app/stories', function(err,data) {

        if(err)
        {
            console.log("err");
            console.log(err);
            res.statusCode = 404;
            res.send('error\n');
        }
        else {
            res.statusCode = 200;
            var resArray = [];
            data.forEach(function(item) { resArray.push(item.split(".")[0])})
            res.send(resArray)
        }

    });

});

app.get('/stories/:name', function (req, res) {


    res.statusCode = 200;

    var name = req.params.name;

    fs.readFile('./app/stories/'+name+'.xml', 'utf8',function(err,data) {
        if(err)
        {
            res.statusCode = 404;
            res.send("story not found");
        }
        else {
            res.set('Content-Type', 'text/xml');
            res.statusCode = 200;
            console.log(data);
            res.send(data);
        }
    });

});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);