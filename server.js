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

function createStep(stepData) {
    var step = {};
    step.id = stepData.id[0];
    step.title = stepData.title[0];
    if (stepData.hasOwnProperty("desc"))
        step.description = stepData.desc[0];
    else
        step.description = "";

    if (stepData.hasOwnProperty("multiple_choice")) {
        step = createMultipleChoiceStep(step, stepData);
    } else if (stepData.hasOwnProperty("end")) {
        step = createEndStep(step, stepData);
    } else if (stepData.hasOwnProperty("maze")) {
        step = createMazeStep(step, stepData);
    } else if (stepData.hasOwnProperty("riddle")) {
        step = createRiddleStep(step, stepData);
    }

    return step;
}

function createMultipleChoiceStep(step, stepData) {
    step.type = 'multiple_choice';
    step.outcomes = [];

    for (var i = 0; i < stepData.multiple_choice[0].outcome.length; ++i) {
        step.outcomes.push({
            text: stepData.multiple_choice[0].outcome[i].text[0],
            nextStep: stepData.multiple_choice[0].outcome[i].nextStep[0]
        });
    }

    step.getPlayInfos = function () {
        return step;
    };
    step.getShowInfos = function () {
        var r = {
            id: step.id,
            type: step.type,
            title: step.title,
            description: step.description,
            outcomes: step.outcomes,
            nextStep: []
        };
        for (var i = 0; i < step.outcomes.length; ++i) {
            r.nextStep.push(step.outcomes[i].nextStep);
        }
        return r;
    }

    return step;
}

function createEndStep(step, stepData) {
    step.type = 'end';
    step.win = stepData.end[0].win[0] === "true";

    step.getPlayInfos = function () {
        return step;
    };
    step.getShowInfos = function () {
        return {
            id: step.id,
            type: step.type,
            title: step.title,
            description: step.description,
            win: step.win,
            nextStep: []
        };
    };

    return step;
}

function createMazeStep(step, stepData) {
    step.type = 'maze';
    step.nextStep = stepData.maze[0].nextStep;
    step.rows = stepData.maze[0].rows[0];
    step.columns = stepData.maze[0].columns[0];

    step.getPlayInfos = function () {
        return step;
    };

    step.getShowInfos = function () {
        return step;
    }

    return step;
}

function createRiddleStep(step, stepData) {
    step.type = 'riddle';
    step.question = stepData.riddle[0].question[0];
    step.hint = stepData.riddle[0].hint[0];
    step.outcomes = [];
    for (var i = 0; i < stepData.riddle[0].outcome.length; ++i) {
        step.outcomes.push({
            text: stepData.riddle[0].outcome[i].text[0],
            nextStep: stepData.riddle[0].outcome[i].nextStep[0]
        });
    }

    step.getPlayInfos = function () {
        return {
            id: step.id,
            title: step.title,
            description: step.description,
            question: step.question
        }
    };

    step.getShowInfos = function () {
        var r = {
            id: step.id,
            type: step.type,
            title: step.title,
            description: step.description,
            question: step.question,
            hint: step.hint,
            nextStep: []
        };
        for (var i = 0; i < step.outcomes.length; ++i) {
            r.nextStep.push(step.outcomes[i].nextStep);
        }
        return r;
    };

    return step;
}

var stories = {};

// Parse the file story_file and load the story in memory
function readStory(story_file) {
    fs.readFile('./app/stories/' + story_file, 'utf-8', function (error, file) {
        if (error) {
            console.log("Error: Can't read " + story_file);
            return;
        }

        var parseString = xml2js.parseString;
        parseString(file, function (error, data) {
            if (error) {
                console.log("Error during parsing " + story_file);
                return;
            }

            var steps = [];

            for (var i = 0; i < data.story.step.length; ++i) {
                steps.push(createStep(data.story.step[i]));
            }
            stories[data.story.name] = {name: data.story.name[0], steps: steps};
        });
        console.log("\t" + story_file);
    });
}

function initStories() {
    console.log('Init stories...');
    fs.readdir('./app/stories', function (err, files) {
        console.log("stories list: ");
        files.filter(function (file) {
            var parts = file.split(".");
            if (parts[1] === 'xml') {
                return true;
            }
            return false;
        }).forEach(function (item) {
            readStory(item);
        });
    });
}
initStories();

app.get('/show/story/:name', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(getShowStory(req.params.name));
});

function getShowStory(storyName) {
    var storyRaw = stories[storyName];

    var story = {
        name: storyRaw.name,
        steps: []
    };
    for (var i = 0; i < storyRaw.steps.length; ++i) {
        story.steps.push(storyRaw.steps[i].getShowInfos());
    }

    return story;
}

app.get('/stories/:name/step/:step', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(getPlayStep(req.params.name, req.params.step));
});

function getPlayStep(storyName, stepId) {
    var storyRaw = stories[storyName];
    var stepRaw = storyRaw.steps[stepId];
    return stepRaw.getPlayInfos();
}

app.get('/stories', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(getStoriesNamesList());
});

function getStoriesNamesList() {
    var r = [];
    console.log("Bonjour");
    for (var i = 0; i < Object.keys(stories).length; ++i) {
        r.push(Object.keys(stories)[i]);
    }
    console.log(r);
    return r;
}


function filterStep(step, filter) {
    var result = step.content[0];


    if (!filter && (typeof step.hiden !== "undefined")) {
        for (var key in step.hiden[0]) {
            result[key] = step.hiden[0][key];
        }
    }

    return result;
}

app.get('/hello/', function (req, res) {
    initCache();
    res.send('hi');
});

app.get('/hello/keys', function (req, res) {
    var mykeys = myCache.keys();
    res.send(mykeys);
});

app.get('/compute/:name/:sizez', function (req, res) {

    //var rep = myCache.get(req.params.name+'.json');
    var rep = stories[req.params.name];
    if (rep === undefined) {
        //send()
    }

    sp.fillgraph(getShowStory(req.params.name).steps);
    var data = sp.shortestPath();
    console.log(data);

    if (req.params.sizez === 'true') {
        res.send(data.length + '');
    }
    else {
        res.send(data);
    }
});

/*app.get('/stories', function (req, res) {
 //read the dir
 console.dir('/stories');
 console.dir(myCache.keys());

 var toSend = [];

 myCache.keys().forEach(function(item)
 {
 console.log(item);

 if( item.split(".")[1] === 'json')
 {
 var sto = myCache.get(item);
 console.log(sto);
 var file = {
 file:item.split(".")[0],
 label:sto.story.$.name
 };
 console.log(file);
 toSend.push(file);
 }

 });

 res.send(toSend);
 });*/

app.get('/show/stories', function (req, res) {
    //read the dir
    console.dir('/stories');
    console.dir(myCache.keys());

    var toSend = [];

    myCache.keys().forEach(function (item) {
        console.log(item);

        if (item.split(".")[1] === 'json') {

            toSend.push(myCache.get(item).name);
        }
    });
    res.send(toSend);

});

app.get('/stories/:name/haveHappyEnd', function (req, res) {

    var json = myCache.get(req.params.name + '.json');
    var found = false;
    json.story.step.forEach(function (item) {
        if (item.content[0].type[0] === 'end' && typeof item.content[0].win !== 'undefined' && item.content[0].win[0] === 'true') {
            res.send(true + '');
            found = true;
            return;
        }
    })
    if (!found)
        res.send(false + '');
});

app.get('/stories/:name/step/:step/reponse/:reponse', function (req, res) {

    var step = parseInt(req.params.step);
    var reponse = req.params.reponse;

    var result = myCache.get(req.params.name + '.json');

    console.dir(result);
    console.dir(result.story.step[step]);
    console.log(step);
    console.dir(result.story.step[step].hiden);
    console.dir(result.story.step[step].hiden[0]);

    var answerS = result.story.step[step].hiden[0].nextStep;

    var minLevDist = 100;

    var found = false;
    //distance
    answerS.forEach(function (answer) {
        if (answer.$.answer == reponse) {

            res.send(answer);
            found = true;
        }
        var lComp = Levenshtein(answer.$.answer, reponse);
        if (lComp < minLevDist)
            minLevDist = lComp;

    });

    if (!found) {

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

console.log('Started on port:' + PORT);
