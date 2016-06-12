'use strict';

const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');

const util = require('util');
const Levenshtein = require('levenshtein');
const sp = require('./app/scripts/shortestpath2.js');
// Constants
const PORT = 8080;
const STORY_PATH = './app/stories/';
var session = require('express-session');
// Use the session middleware


// App
const app = express();

app.use(
    session(
        { secret: 'keyboard cat', cookie: { maxAge: 3600*24*6000  }}));


function update(sess,story,step,create)
{
    console.dir(story);
    console.dir(step);
    console.dir(sess.view);


    if(create)
    {
        sess.views = {story:story,step:step,item:{}}
        sess.views.item[story]=[];
    }
    if(step==0)
    {
        sess.views.item[story]=[];
    }

    sess.views.story=story;
    sess.views.step=step;

    sess.save(function(err) {
        console.dir(sess.views);
    })


}



function createStep(stepData) {

    var step = {};
    step.id = stepData.id[0];

    step.title = stepData.title[0];
    if (stepData.hasOwnProperty("desc"))
        step.description = stepData.desc[0];
    else
        step.description = "";

    if (stepData.hasOwnProperty("given"))
        step.given = stepData.given;
    else
        step.given = "";

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

function copyStepBasicData(from, to){
    to.title = from.title;
    to.description = from.description;
    to.type = from.type;
    to.id = from.id;
    to.given = from.given;


    return to;
}
function createMultipleChoiceStep(step, stepData) {
    step.type = 'multiple_choice';
    step.outcomes = [];

    if(!Array.isArray(stepData.multiple_choice[0].outcome))
        {
            step.outcomes.push({
                text: stepData.multiple_choice[0].outcome.text[0],
                nextStep: stepData.multiple_choice[0].outcome.nextStep[0]
            });
        }
    else {
        for (var i = 0; i < stepData.multiple_choice[0].outcome.length; ++i) {
            step.outcomes.push({
                text: stepData.multiple_choice[0].outcome[i].text[0],
                nextStep: stepData.multiple_choice[0].outcome[i].nextStep[0]
            });
        }
    }

    step.getPlayInfos = function () {
        return copyStepBasicData(step, {
            outcomes: step.outcomes
        });
    };
    step.getShowInfos = function () {
        var r = copyStepBasicData(step, {
            outcomes: step.outcomes,
            nextStep: []
        });
        for (var i = 0; i < step.outcomes.length; ++i) {
            r.nextStep.push(step.outcomes[i].nextStep);
        }
        return r;
    };

    return step;
}

function createEndStep(step, stepData) {
    step.type = 'end';
    step.win = stepData.end[0].win[0] === "true";

    step.getPlayInfos = function () {
        return copyStepBasicData(step, {
            win: step.win
        });
    };
    step.getShowInfos = function () {
        return copyStepBasicData(step, {
            win: step.win,
            nextStep: []
        });
    };

    return step;
}

function createMazeStep(step, stepData) {
    step.type = 'maze';
    step.nextStep = stepData.maze[0].nextStep;
    step.rows = stepData.maze[0].rows[0];
    step.columns = stepData.maze[0].columns[0];

    step.getPlayInfos = function () {
        return copyStepBasicData(step, {
            nextStep: step.nextStep,
            rows: step.rows,
            columns: step.columns
        })
    };

    step.getShowInfos = function () {
        return copyStepBasicData(step, {
            nextStep: step.nextStep,
            rows: step.rows,
            columns: step.columns
        })
    };

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
        return copyStepBasicData(step, {
            question: step.question
        });
    };

    step.getShowInfos = function () {
        var r = copyStepBasicData(step, {
            question: step.question,
            hint: step.hint,
	    outcomes: step.outcomes,
            nextStep: []
        });
        for (var i = 0; i < step.outcomes.length; ++i) {
            r.nextStep.push(step.outcomes[i].nextStep);
        }
        return r;
    };

    step.verifyAnswer = function(data){
        var minLevDist = 100;
        var trimmedText = data.tri;
        var found = false;
        var nextStep;
        //distance
        step.outcomes.forEach(function (outcome) {
            if (outcome.text == data) {
                found = true;
                nextStep = outcome.nextStep;
                return;
            }
            var lComp = Levenshtein(outcome.text, data);
            if (lComp < minLevDist)
                minLevDist = lComp;
        });
        if (found)
            return {
                correct: true,
                nextStep: nextStep
            };
        else
            return {
                correct: false,
                hint: step.hint,
                distance: minLevDist
            }
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

            console.log("\t" + data.story.name[0]);
            var steps = [];

            for (var i = 0; i < data.story.step.length; ++i) {
                try {
                    steps[data.story.step[i].id[0]] = (createStep(data.story.step[i]));
                }
                catch (ex)
                {

                    console.log('step '+i+' invalid ! because');
                    console.dir(ex);
                    console.dir(data.story.step[i]);
                    throw(ex);
                }
            }
            stories[story_file.slice(0, -4)] = {
                name: data.story.name[0],
                file: story_file,
                steps: steps};
        });
        console.log("\t\t" + story_file);
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
    if (req.params.name in stories) {
	res.set('Content-Type', 'application/json');
	res.send(getShowStory(req.params.name));
    } else {
        res.statusCode = 400;
	res.send('Error: can\t find story ' + req.params.name);
    }
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

app.get('/play/:storyName/:step', function (req, res) {
    res.set('Content-Type', 'application/json');
    var step = getPlayStep(req.params.storyName, req.params.step);
    res.send(step);

    var sess = req.session;
    if (!sess.views) {
        console.log('creating session');
        update(sess,req.params.storyName,req.params.step,true);
    }
    else {
        console.log('update session');
        update(sess,req.params.storyName,req.params.step,false)
    }
    if(step.given!=undefined&&step.given!=='')
    {
        step.given.forEach(function(item){
            sess.views.item[req.params.storyName].push(item);
        });
        req.session.save(function(err) {
        })
    }

});

function getPlayStep(storyName, stepId) {
    var storyRaw = stories[storyName];
    console.log(storyName);
    var stepRaw = storyRaw.steps[stepId];
    console.log(stepRaw.getPlayInfos());
    return stepRaw.getPlayInfos();
}

app.get('/stories', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(getStoriesNamesList());
});

app.get('/play/stepAction/:storyName/:step/:action/:data', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send(stories[req.params.storyName].steps[req.params.step][req.params.action](req.params.data));


});



function getStoriesNamesList() {
    var r = [];
    for (var i = 0; i < Object.keys(stories).length; ++i) {
        r.push({
            file: Object.keys(stories)[i],
            label: stories[Object.keys(stories)[i]].name
        });
    }
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

app.get('/shortestPath/:storyName/:onlySize', function (req, res) {

    var rep = stories[req.params.storyName];

    sp.fillgraph(getShowStory(req.params.storyName).steps);
    var data = sp.shortestPath();
    console.log(data);

    if (req.params.onlySize === 'true') {
        res.send(data.length + '');
    }
    else {
        res.send(data);
    }
});

//TODO: update this
app.get('/stories/:name/haveHappyEnd', function (req, res) {

    var json = myCache.get(req.params.name + '.json');
    var rep = stories[req.params.name];
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



function toXML(result,rootNameParam)
{
    var builder = new xml2js.Builder({rootName: rootNameParam, explicitArray: true});
    var xml2 = builder.buildObject(result);
    return builder.buildObject(result);
}

//TODO: debug this
app.post('/stories/', function (req, res) {

    console.log(req.body);

    var xmltoStore = toXML(req.body.story,'story');

    //console.dir(req);
    var path = './app/stories/.tmp/';


    // Logic for handling missing file, wrong mimetype, no buffer, etc.


    fs.writeFile(STORY_PATH+req.body.story.file+'.xml', xmltoStore, function (err) {
        if(err) {
            res.status(400).send({
                message: 'Problem saving the file. Please try again.'
            });
        }
        else {
            console.log("Write");
            console.log();
            console.log(xmltoStore);
            res.redirect("back");

        }
    });




});



// Access the session as req.session
app.get('/inventory', function(req, res, next) {
    var sess = req.session;
    if (sess.views) {
        res.send(sess.views);
    } else {
        res.send([]);
    }

});

app.get('/getLastStep', function(req, res, next) {
    var sess = req.session;
    if (sess.views) {
        res.redirect('/play/'+sess.views.story+"/"+sess.views.step);
        //res.send(sess.views);
    } else {
        res.send('no session',503);

    }

});

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/'));

app.get('*', function(req, res){
    res.send('404 not found', 404);
});

app.listen(PORT);

console.log('Started on port:' + PORT);
