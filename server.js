'use strict';

const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js')
const multer = require('multer');

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
            var stories = [];
            data.forEach(function(item) {
                var paths = item.split(".");
                if(paths[1]=='xml') {
                    var story = {
                        $: {
                            file: paths[0],
                            label: paths[0]
                        }
                    };
                    stories.push(story);
                }
            });
            var builder = new xml2js.Builder({rootName: 'stories',explicitArray : true});
            var wrap ={ story: stories};

            var xml2 = builder.buildObject(wrap);
            console.dir(xml2);
            res.send(xml2);

        }

    });

});

app.get('/show/stories/:name', function (req, res) {

    var name = req.params.name;
    //fs.readFile('./app/stories/'+name+'.xml', 'utf8',function(err,data) {
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

    var name = req.params.name;
    var step = req.params.step;

    //fs.readFile('./app/stories/'+name+'.xml', 'utf8',function(err,data) {
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

            parseString(data, function (err, result) {


                var builder = new xml2js.Builder({rootName: 'content'});
                try{
                var xml2 = builder.buildObject(result.story.step[step].content[0]);
                console.dir(xml2);
                res.send(xml2);
                }
                catch (e){
                    console.log("error");
                    console.log(step);
                }
            });
        }
    });

});

app.get('/stories/:name/step/:step/reponse/:reponse', function (req, res) {
    var name = req.params.name;
    var step = req.params.step;
    var reponse = req.params.reponse;

    fs.readFile('./app/stories/'+name+'.xml', 'utf8',function(err,data) {
        if (err) {
            res.statusCode = 404;
            res.send("story not found");
        }
        else {


            res.statusCode = 200;

            var parseString = xml2js.parseString;
            var xml = data;

            parseString(xml, function (err, result) {
                if (err) {
                    res.statusCode = 404;
                    res.send("bad story");
                }

                res.set('Content-Type', 'text/xml');

                var answer = result.story.step[step].hiden[0].answer[0];
                console.dir("answerSS");
                console.dir(answer);
                console.dir("answerSS");
                console.dir(answer._);
                console.dir("answerSS");
                console.dir(reponse);
                console.dir("answerSS");
                if(answer._ == reponse){
                    var builder = new xml2js.Builder({rootName: 'answer'});
                    var xml2 = builder.buildObject(answer);
                    console.dir(xml2);
                    res.statusCode = 200;
                    res.send(xml2);
                }
                else {
                    var builder = new xml2js.Builder({rootName: 'hint'});
                    try{
                    var xml2 = builder.buildObject(result.story.step[step].hiden[0].hint[0]);

                    }
                    catch(e){}
                    res.statusCode = 210;
                    console.dir(xml2);
                    res.send(xml2);
                }

            });
        }
    });
});
var upload = multer({
    dest: './app/stories/',
    rename: function(fieldname, filename) {
        return filename;
    },
    inMemory: true //This is important. It's what populates the buffer.
    ,
    onFileUploadStart: function(file) {
        console.log('Starting ' + file.fieldname);
    },
    onFileUploadData: function(file, data) {
        console.log('Got a chunk of data!');
    },
    onFileUploadComplete: function(file) {
        console.log('Completed file!');
    },
    onParseStart: function() {
        console.log('Starting to parse request!');
    },
    onParseEnd: function(req, next) {
        console.log('Done parsing!');
        next();
    },
    onError: function(e, next) {
        if (e) {
            console.log(e.stack);
        }
        next();
    }
});

app.post('/stories/:name', upload.any(), function(req, res){

    var name = req.params.name;
    console.log("gotpost");
    //console.log(req);
    console.log('fileName'+req.files);
    var file = req.files.file[0];

    var path = './app/stories/';
    console.log("path"+file);

    // Logic for handling missing file, wrong mimetype, no buffer, etc.

    var buffer = file.buffer; //Note: buffer only populates if you set inMemory: true.
    var fileName = file.name;
    var stream = fs.createWriteStream(path + fileName);
    stream.write(buffer);
    stream.on('error', function(err) {
        console.log('Could not write file to memory.');
        res.status(400).send({
            message: 'Problem saving the file. Please try again.'
        });
    });
    stream.on('finish', function() {

        res.status(204);
    });
    stream.end();
    console.log('Stream ended.');
});

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/'));


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);