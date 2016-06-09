'use strict';

const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');
const multer = require('multer');
const util = require('util');
const Levenshtein = require('levenshtein');

// Constants
const PORT = 8080;

// App
const app = express();

function unpack(graph,from)
{
    var route = [];
    while(from!=0)
    {
        route.push(from);
        from = graph[from].visited;
    }
    route.push("0");
    return route.reverse();
}

function addVertex(graph,item)
{
 var vertex = {
        id: item.content[0].id[0],
        end: false,
        visited: 0,
        to: []
    };

    if(typeof item.content[0].win !== 'undefined' ) {
        console.dir(item.content[0].win[0]);
    }



    if(item.content[0].type[0]==='end'&&typeof item.content[0].win !== 'undefined' && item.content[0].win[0]==='true')
    {
        console.log('found end');
        vertex.end = true;
    }
    if(typeof item.content[0].nextStep !== 'undefined' && item.content[0].nextStep) {
        console.log('adding EDGES');
        console.log(item.content[0].nextStep);

        item.content[0].nextStep.forEach(function (nextStepID) {
            console.log('adding edge');
            vertex.to.push(nextStepID._);
            console.log(nextStepID._);
        });
    }
    if(typeof item.hiden !== 'undefined' ) {
        console.log('adding HIDDEN');
        console.log(item.hiden[0].answer);
        item.hiden[0].answer.forEach(function (nextStepID) {
            console.log('next');
            console.log(nextStepID.$.stepId);
            vertex.to.push(nextStepID.$.stepId);
        });

    }
    console.dir(vertex);
    graph.push(vertex);
}
function shortestPath(graph,onlyLength) {
    //graph is arrayVertex[ vertex{id:id, end: true, visited:id to:[ids]}]
    //result is an array
    console.log('Function');
    console.log(graph);
    var iDtoExplore = [];
    iDtoExplore.push(0);



    while (iDtoExplore.length>0) {
        var indexCur = iDtoExplore.shift();

        console.log('exploring');
        console.log(indexCur);
        console.log(graph[indexCur]);
        //if (graph[indexCur].visited !== false){
          //  continue;
        // }
        console.log('win?' );
        console.log(graph[indexCur].end);

        if(graph[indexCur].end === true)
        {
            console.log('path -------------------------------------0000000000000000000000000000000000000000 ');
            console.log(unpack(graph,indexCur));
            if(onlyLength === true)
            {
                return unpack(graph,indexCur).length;
            }
            return unpack(graph,indexCur);
        }

        graph[indexCur].to.forEach(function (item) {
            if(graph[item].visited==false)
            {
                graph[item].visited = indexCur;
                iDtoExplore.push(item);
            }
        });

    }

}


app.get('/compute/:name/:length', function (req, res) {
    console.log('shortestP');

    var name = req.params.name;
    var length = req.params.length;
    console.log('shortestP');
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
                var graph = [];
                console.log(result);
                console.log(result.story);
                console.log(result.story.step);

                result.story.step.forEach(function(item) {
                    addVertex(graph,item);
                });

                console.log('graph');
                console.log(graph);
                var data = shortestPath(graph);

                //res.set('Content-Type', 'text/xml');
                res.statusCode = 200;
                console.log(data);
                console.log(length);
                if(length === 'false'){
                    res.send(data);
                } else {

                    res.send(data.length+'');
                }
            });
        }
    });



});

app.get('/stories', function (req, res) {
    fs.readdir('./app/stories', function (err, data) {

        if (err) {
            console.log("err");
            console.log(err);
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
                console.log('foreach');
                console.log(item);
                var paths = item.split(".");
                if (paths[1] == 'xml') {

                    //lire fichier pour name
                    fs.readFile('./app/stories/' + item, 'utf8', function (err, data2) {
                        if (err) {
                            console.log('error get story xml');
                        }
                        else {

                            var parseString = xml2js.parseString;

                            parseString(data2, function (err, result) {
                                if (err) {
                                    console.log('error get story xml parseString');
                                    return;
                                }
                                console.log('parsing name');

                                console.log(result.story.$.name);
                                var story = {
                                    $: {
                                        file: paths[0],
                                        label: result.story.$.name
                                    }
                                };
                                stories.push(story);

                                if(toDoS==stories.length)
                                {
                                    console.log("ok");
                                    var builder = new xml2js.Builder({rootName: 'stories', explicitArray: true});
                                    var wrap = {story: stories};

                                    var xml2 = builder.buildObject(wrap);
                                    console.dir(xml2);

                                    res.send(xml2);
                                }
                                else
                                {
                                    console.log('notFinished');
                                    console.log(stories.length);
                                    console.log(data.length);
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
            console.log(data);
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
                    console.dir(xml2);
                    res.send(xml2);
                }
                catch (e) {
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
                console.log("answers");
                console.log(answerS);
                console.log("answers");
                console.log(answerS[0]);

                answerS.forEach(function (answer) {
                    if (answer._ == reponse) {
                        var builder = new xml2js.Builder({rootName: 'answer'});
                        var xml2 = builder.buildObject(answer);
                        console.dir(xml2);
                        res.statusCode = 200;
                        res.send(xml2);
                    }
                    var lComp = Levenshtein( answer._, reponse );
                    console.dir("distance between"+answer._+" and "+reponse);
                    console.dir(lComp);
                    if(lComp < minLevDist)
                        minLevDist=lComp;

                });

                console.log(answerS[0]);

                try {

                    console.log(minLevDist);

                    var hint = {
                        _: result.story.step[step].hiden[0].hint[0],
                        $: {
                            distance: minLevDist
                        }
                    };
                    var builder = new xml2js.Builder({rootName: 'hint'});
                    var xml2 = builder.buildObject(hint);
                    console.dir(xml2);
                    console.log("OK");
                    console.dir(result.story.step[step].hiden[0].hint[0]);

                    
                }
                catch (e) {
                    console.log("err");
                }
                res.statusCode = 210;
                console.dir(xml2);
                res.send(xml2);


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
        console.log('Starting ' + file.fieldname);
    },
    onFileUploadData: function (file, data) {
        console.log('Got a chunk of data!');
    },
    onFileUploadComplete: function (file) {
        console.log('Completed file!');
    },
    onParseStart: function () {
        console.log('Starting to parse request!');
    },
    onParseEnd: function (req, next) {
        console.log('Done parsing!');
        next();
    },
    onError: function (e, next) {
        if (e) {
            console.log(e.stack);
        }
        next();
    }
});





app.post('/stories/:name', upload.any(), function (req, res) {

    var name = req.params.name;
    console.log("gotpost");
    //console.log(req);
    console.log('fileName' + req.files);
    var file = req.files.file[0];

    var path = './app/stories/';
    console.log("path" + file);

    // Logic for handling missing file, wrong mimetype, no buffer, etc.

    var buffer = file.buffer; //Note: buffer only populates if you set inMemory: true.
    var fileName = file.name;
    var stream = fs.createWriteStream(path + fileName);
    stream.write(buffer);
    stream.on('error', function (err) {
        console.log('Could not write file to memory.');
        res.status(400).send({
            message: 'Problem saving the file. Please try again.'
        });
    });
    stream.on('finish', function () {

        res.status(204);
    });
    stream.end();
    console.log('Stream ended.');
});


app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/'));


app.listen(PORT);
console.log('Running on http://localhost:' + PORT);