/**
 * Created by user on 09/06/2016.
 */
'use strict';
var graph = [];

function hello2()
{
    console.log('hello from the inside');
}

function unpack(from)
{
    var route = [];
    while(from!==0)
    {
        route.push(from);
        console.log('step');
        console.log(graph[from]);
        from = graph[from].visited;
    }
    route.push("0");
    return route.reverse();
}

function addVertex(item)
{
    console.log(item);
    var vertex = {
        id: item.content[0].id[0],
        end: false,
        visited: 0,
        to: []
    };

    if(item.content[0].type[0]==='end'&&typeof item.content[0].win !== 'undefined' && item.content[0].win[0]==='true')
    {
        vertex.end = true;
    }

    if(typeof item.content[0].nextStep !== 'undefined' && item.content[0].nextStep) {
        console.log('adding EDGES');
        console.log(item.content[0].nextStep);

        item.content[0].nextStep.forEach(function(nextStepID) {
            console.log('adding edge');
            vertex.to.push(nextStepID._);
            console.log(nextStepID._);
        });
    }

    if(typeof item.hiden !== 'undefined' ) {
        console.log('adding HIDDEN');
        console.log(item.hiden[0].answer);
        item.hiden[0].answer.forEach(function(nextStepID) {
            console.log('next');
            console.log(nextStepID.$.stepId);
            vertex.to.push(nextStepID.$.stepId);
        });

    }
    console.dir(vertex);
    graph.push(vertex);
}

function fillgraph(steps){
    graph = [];
    
    steps.forEach(function(item) {
        addVertex(item);
    });
}
function shortestPath(onlyLength) {
    //graph is arrayVertex[ vertex{id:id, end: true, visited:id to:[ids]}]
    //result is an array
    console.log('Function');
    console.log(graph);
    var iDtoExplore = [];
    iDtoExplore.push(0);

    console.log('exploring');
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
            console.log(unpack(indexCur));

            if(onlyLength === 'true')
            {
                console.dir('dist');
                console.dir('dist');
                var len = unpack(indexCur).length+'';
                console.dir(len);
                return len;
            }
            return unpack(indexCur);
        }
        console.log('not an end');
        graph[indexCur].to.forEach(function(item) {
            console.log('out');

            if(graph[item].visited===0)
            {
                console.log('out');
                graph[item].visited = indexCur;
                iDtoExplore.push(item);
                console.log(iDtoExplore.length);
            }
        });
        console.log('ddd');

    }

    console.log(iDtoExplore.length);
    var data = [];

    return data;

}














module.exports = {


    hello2: hello2,

    unpack: unpack,
    addVertex: addVertex,
    fillgraph: fillgraph,
    shortestPath: shortestPath,


};