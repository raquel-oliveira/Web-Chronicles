'use strict';

const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js')

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

app.get('/stories/:name/step/:step', function (req, res) {


    res.statusCode = 200;

    var name = req.params.name;
    var step = req.params.step;

    fs.readFile('./app/stories/'+name+'.xml', 'utf8',function(err,data) {
        if(err)
        {
            res.statusCode = 404;
            res.send("story not found");
        }
        else {
            res.set('Content-Type', 'text/xml');

            res.statusCode = 200;

            var parseString = xml2js.parseString;
            var xml = data;
            parseString(xml, function (err, result) {
                console.dir(result);
                var builder = new xml2js.Builder({rootName: 'step'});
                var xml2 = builder.buildObject(result.story.step[0]);
                console.dir(xml2);
                res.send(xml2);
            });

           /* console.log(data);
            var inXML = xml(data);
            console.log('step--------------')
            console.log(inXML)
            console.log('step2--------------')
            res.send(data);*/
        }
    });

});

/*app.get('*', function(req, res) {
 console.log('returning index'+req.baseUrl);
 var path = req.params[0] ? req.params[0] : 'index.html';
 console.log(path);

 console.log(req.baseUrl);
 res.sendFile(__dirname+ app + path); // load the single view file (angular will handle the page changes on the front-end)
 });*/

app.get('*', function (req, res) {
    var path = req.params[0] ? req.params[0] : 'index.html';

    res.sendFile(__dirname+ "/../app/"+path);
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);