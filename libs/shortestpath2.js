/**
 * Created by user on 09/06/2016.
 */
'use strict';
var graph = [];

function ShortPath(){
    this.hello2 = hello2();
    this.unpack = unpack();
    this.addVertex = addVertex();
    this.fillgraph = fillgraph();
    this.shortestPath = shortestPath();
}

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
        id: item.content[0].id[0],
        end: false,
        visited: -1,
        to: []
    };

    if(item.content[0].type[0]==='end'&&typeof item.content[0].win !== 'undefined' && item.content[0].win[0]==='true')
    {
        vertex.end = true;
    }

    if(typeof item.content[0].nextStep !== 'undefined' && item.content[0].nextStep) {



        item.content[0].nextStep.forEach(function(nextStepID) {

            vertex.to.push(nextStepID._);

        });
    }

    if(typeof item.hiden !== 'undefined' ) {


        item.hiden[0].answer.forEach(function(nextStepID) {


            vertex.to.push(nextStepID.$.stepId);
        });

    }

    graph.push(vertex);
}

function fillgraph(steps){
    graph = [];
    
    steps.forEach(function(item) {
        addVertex(item);
    });
}
function shortestPath() {
    //graph is arrayVertex[ vertex{id:id, end: true, visited:id to:[ids]}]
    //result is an array


    var iDtoExplore = [];
    iDtoExplore.push(0);

    console.log(graph);

    while (iDtoExplore.length>0) {
        var indexCur = iDtoExplore.shift();
        console.log('exploring');
        console.log(indexCur);
        console.log(graph[indexCur]);
        console.log(graph[indexCur].end);

        if(graph[indexCur].end === true || graph[indexCur].end ==='true')
        {
            console.log('end');
            return unpack(indexCur);
        }

        graph[indexCur].to.forEach(function(item) {


            if(graph[item].visited===-1)
            {
                console.log('add');
                console.log(item);
                graph[item].visited = indexCur;
                iDtoExplore.push(item);

            }
        });


    }

    console.log('not found');

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