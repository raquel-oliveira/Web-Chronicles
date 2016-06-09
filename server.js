'use strict';

const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');
const multer = require('multer');
const util = require('util');
const Levenshtein = require('levenshtein');
const sp = require('./app/scripts/shortestpath2.js');
// Constants
const PORT = 8080;

// App
const app = express();


app.get('/hello/',function (req, res) {
    sp.hello2();
    res.send('say');
});

app.get('/compute/:name/:sizez', function (req, res) {

    var name = req.params.name;
    var lengthAsked = req.params.sizez;
    
    fs.readFile('./app/stories/' + name + '.xml', 'utf8', function (err, data) {
        if (err) {
            res.statusCode = 404;

            res.send("story not found");
        }
        else {
            var parseString = xml2js.parseString;
            parseString(data, function (err, result) {
                if (err) {
                    res.statusCode = 404;

                    res.send("bad story");
                }
                //construct graph representation
                
                sp.fillgraph(result.story.step);

                var data = sp.shortestPath(lengthAsked);

                //res.set('Content-Type', 'text/xml');

                res.statusCode = 200;
                res.send(data);

            });
        }
    });



});

app.get('/stories', function (req, res) {
    fs.readdir('./app/stories', function (err, data) {

        if (err) {
            
            res.statusCode = 404;
            res.send('error\n');
        }
        else {
            //res.statusCode = 200;
            var stories = [];
            var toDoS = 0;
            data.forEach(function (item) {

                var paths = item.split(".");
                if (paths[1] == 'xml') {
                    toDoS++;
                }
            });
            data.forEach(function (item) {

                var paths = item.split(".");
                if (paths[1] == 'xml') {

                    //lire fichier pour name
                    fs.readFile('./app/stories/' + item, 'utf8', function (err, data2) {
                        if (err) {
                            
                        }
                        else {

                            var parseString = xml2js.parseString;

                            parseString(data2, function (err, result) {
                                if (err) {
                                    
                                    return;
                                }
                                

                                
                                var story = {
                                    $: {
                                        file: paths[0],
                                        label: result.story.$.name
                                    }
                                };
                                stories.push(story);

                                if(toDoS==stories.length)
                                {
                                    
                                    var builder = new xml2js.Builder({rootName: 'stories', explicitArray: true});
                                    var wrap = {story: stories};

                                    var xml2 = builder.buildObject(wrap);
                                    

                                    res.send(xml2);
                                }
                                else
                                {
                                    
                                    
                                    
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


app.get('/show/stories/:name', function (req, res) {

    var name = req.params.name;
    //fs.readFile('./app/stories/'+name+'.xml', 'utf8',function(err,data) {
    fs.readFile('./app/stories/' + name + '.xml', 'utf8', function (err, data) {
        if (err) {
            res.statusCode = 404;
            res.send("story not found");
        }
        else {
            res.set('Content-Type', 'text/xml');
            res.statusCode = 200;
            
            res.send(data);
        }
    });

});


app.get('/stories/:name/step/:step', function (req, res) {

    var name = req.params.name;
    var step = req.params.step;

    //fs.readFile('./app/stories/'+name+'.xml', 'utf8',function(err,data) {
    fs.readFile('./app/stories/' + name + '.xml', 'utf8', function (err, data) {
        if (err) {
            res.statusCode = 404;
            res.send("story not found");
        }
        else {
            res.set('Content-Type', 'text/xml');

            res.statusCode = 200;

            var parseString = xml2js.parseString;

            parseString(data, function (err, result) {


                var builder = new xml2js.Builder({rootName: 'content'});
                try {
                    var xml2 = builder.buildObject(result.story.step[step].content[0]);
                    
                    res.send(xml2);
                }
                catch (e) {
                }
            });
        }
    });

});

app.get('/stories/:name/step/:step/reponse/:reponse', function (req, res) {
    var name = req.params.name;
    var step = req.params.step;
    var reponse = req.params.reponse;

    fs.readFile('./app/stories/' + name + '.xml', 'utf8', function (err, data) {
        if (err) {
            res.statusCode = 404;
            res.send("story not found");
        }
        else {

            
            var parseString = xml2js.parseString;
            var xml = data;
            parseString(xml, function (err, result) {
                if (err) {
                    res.statusCode = 404;
                    res.send("bad story");
                }

                res.set('Content-Type', 'text/xml');


                var answerS = result.story.step[step].hiden[0].answer;
                var minLevDist = 100;
                
                
                var found = false;
                answerS.forEach(function (answer) {
                    if (answer._ == reponse) {
                        var builder = new xml2js.Builder({rootName: 'answer'});
                        var xml2 = builder.buildObject(answer);
                        
                        res.statusCode = 200;
                        res.send(xml2);
                        found = true;
                    }
                    var lComp = Levenshtein( answer._, reponse );
                    
                    
                    if(lComp < minLevDist)
                        minLevDist=lComp;

                });

                if(!found) {
                    try {

                        

                        var hint = {
                            _: result.story.step[step].hiden[0].hint[0],
                            $: {
                                distance: minLevDist
                            }
                        };
                        var builder = new xml2js.Builder({rootName: 'hint'});
                        var xml2 = builder.buildObject(hint);
                        
                        
                        


                    }
                    catch (e) {
                        
                    }
                    res.statusCode = 210;
                    
                    res.send(xml2);
                }

            });
        }
    });
});


var upload = multer({
    dest: './app/stories/',
    rename: function (fieldname, filename) {
        return filename;
    },
    inMemory: true //This is important. It's what populates the buffer.
    ,
    onFileUploadStart: function (file) {
        
    },
    onFileUploadData: function (file, data) {
        
    },
    onFileUploadComplete: function (file) {
        
    },
    onParseStart: function () {
        
    },
    onParseEnd: function (req, next) {
        
        next();
    },
    onError: function (e, next) {
        if (e) {
            
        }
        next();
    }
});






app.post('/stories/:name', upload.any(), function (req, res) {

    var name = req.params.name;
    
    //
    
    var file = req.files.file[0];

    var path = './app/stories/';
    

    // Logic for handling missing file, wrong mimetype, no buffer, etc.

    var buffer = file.buffer; //Note: buffer only populates if you set inMemory: true.
    var fileName = file.name;
    var stream = fs.createWriteStream(path + fileName);
    stream.write(buffer);
    stream.on('error', function (err) {
        
        res.status(400).send({
            message: 'Problem saving the file. Please try again.'
        });
    });
    stream.on('finish', function () {

        res.status(204);
    });
    stream.end();
    
});


app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/'));


app.listen(PORT);
