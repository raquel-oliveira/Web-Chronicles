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


        from = graph[from].visited;
    }
    route.push("0");
    return route.reverse();
}

function addVertex(item)
{
    var vertex = {
        end: false,
        visited: -1,
        to: []
    };

    if (item.type === 'end' &&
	typeof item.win !== 'undefined' &&
	item.win === true) {
        vertex.end = true;
    }

    if(typeof item.nextStep !== 'undefined' && item.nextStep) {

        item.nextStep.forEach(function(nextStepID) {

            vertex.to.push(nextStepID);

        });
    }

    graph[item.id] = vertex;
}

function fillgraph(steps){
    graph = {};

    steps.forEach(function(item) {
        addVertex(item);
    });

}
function shortestPath() {
    //graph is arrayVertex[ vertex{id:id, end: true, visited:id to:[ids]}]
    //result is an array


    var iDtoExplore = [];
    iDtoExplore.push(0);
    while (iDtoExplore.length>0) {
        var indexCur = iDtoExplore.shift();

        if(graph[indexCur].end === true || graph[indexCur].end ==='true')
        {
            console.log('end');
            return unpack(indexCur);
        }

        graph[indexCur].to.forEach(function(item) {

            if(graph[item].visited===-1)
            {


                graph[item].visited = indexCur;
                iDtoExplore.push(item);

            }
        });


    }

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
