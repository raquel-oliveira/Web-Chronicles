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
const STORY_PATH = './app/stories/';

// App
const app = express();

function toXML(result)
{
    var builder = new xml2js.Builder({rootName: 'stories', explicitArray: true});
    var xml2 = builder.buildObject(result);
    return builder.buildObject(result);
}


var NodeCache = require( "node-cache" );
var myCache = new NodeCache( { stdTTL: 0, checkperiod: 0 } );

function initCache(fileName) {
    console.log('init cahc');
    console.log(fileName);
    fs.readdir('./app/stories', function (err, files) {
            files
            .filter(function(file) {
                var parts = file.split(".");
                if(parts[1] === 'xml' )
                {
                    if(fileName===undefined)
                    {
                        return true;
                    }
                    if(fileName===parts[0])
                    {
                        return true;
                    }

                }
                return false;
            })
            .forEach(function (item) {
                    var name = item.split(".")[0];
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

                                result.file = name;
                               // stories.push(story);
                                myCache.set(name+'.json',result);
                                myCache.set(name+'.xml', toXML(result));
                                console.log("added "+name+" to cache");

                            });
                        }
                    });

            });

    });
}

initCache();

function contains(key)
{
    var keyToF = key+'.xml';
    myCache.keys().forEach(function (item) {
        if(keyToF===item.file)
        {
            return true;
        }
    });
    return false;
}


app.get('/show/story/:name',function (req, res) {
    if( req.accepts('xml'))
    {
        res.set('Content-Type', 'text/xml');
        res.send(myCache.get(req.params.name+'.xml'));
    }
    else {
        res.set('Content-Type', 'application/json');
        res.send(myCache.get(req.params.name+'.json'));
    }

});

app.get('/hello/',function (req, res) {
    initCache();
    res.send('hi');
});

app.get('/hello/keys',function (req, res) {
    //myCache.set(item+'.json',result);
    //var value = myCache.get( "myKey" );
    var mykeys = myCache.keys();
    res.send(mykeys);
});

app.get('/compute/:name/:sizez', function (req, res) {

    var rep = myCache.get(req.params.name+'.json');


    sp.fillgraph(rep.story.step);
    var data = sp.shortestPath();
    console.log(data);
    
    if(req.params.sizez === 'true')
    {
        res.send(data.length);
    }
    else {
        res.send(data);
    }
});

app.get('/stories', function (req, res) {
    //read the dir
    console.dir('/stories');
    console.dir(myCache.keys());

    var toSend = [];

    myCache.keys().forEach(function(item)
    {
        console.log(item);

        if( item.split(".")[1] === 'json')
        {
            toSend.push(item)
        }
    });

    var stories =  myCache.mget(toSend);
    console.dir('/stories');
    res.send(stories);

});

app.get('/stories/:name/step/:step', function (req, res) {

    var name = req.params.name;
    var step = req.params.step;

    var json = myCache.get(req.params.name+'.json');
    res.send(json.story.step[step].content[0]);


});

app.get('/stories/:name/step/:step/reponse/:reponse', function (req, res) {

    var step = parseInt(req.params.step);
    var reponse = req.params.reponse;

    var result = myCache.get(req.params.name+'.json');

    console.dir(result);
    console.dir(result.story.step[step]);
    console.log(step);
    console.dir(result.story.step[step].hiden);
    console.dir(result.story.step[step].hiden[0]);
    var answerS = result.story.step[step].hiden[0].answer;
    var minLevDist = 100;

    var found = false;
    //distance
    answerS.forEach(function (answer) {
        if (answer._ == reponse) {

            res.send(answer);
            found = true;
        }
        var lComp = Levenshtein( answer._, reponse );
        if(lComp < minLevDist)
            minLevDist=lComp;

    });

    if(!found) {

        var hint = {
            hint: result.story.step[step].hiden[0].hint[0],
            distance: minLevDist

        };

        res.statusCode = 210;
        res.send(hint);
    }


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

console.log('Started on port:'+PORT);