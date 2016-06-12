'use strict';
var myApp = angular.module('cApp');

myApp.factory('graph', function() {
    function addEdge(edges, from, to) {
        edges.add({
            id: edges.length,
            from: from,
            to: to,
            arrows: {to: true}
        });
    }

    function addNode(nodes, id, color, fontColor) {
	if (typeof color === "undefined") { color = "#D2E5FF"; }
	if (typeof fontColor === "undefined") { fontColor = "#343434"; }


        nodes.add({
                id: id,
            label: id,
	    color: color,
	    font: { color: fontColor }
        });
    }

    return {
	getGraphData: function(story) {
	    var nodes = new vis.DataSet([]);
	    var edges = new vis.DataSet([]);

	    for (var i = 0; i < story.steps.length; ++i) {
		var color, fontColor;

		if (story.steps[i].type === 'end') {
                    color = (story.steps[i].win === false) ?
                        '#882222' : '#228822';
		    fontColor = "#FFFFFF";
		}

		addNode(nodes, parseInt(story.steps[i].id), color, fontColor);

		if (typeof story.steps[i].nextStep !== "undefined") {
                    for (let j = 0; j < story.steps[i].nextStep.length; ++j) {
                        addEdge(edges, parseInt(story.steps[i].id), parseInt(story.steps[i].nextStep[j]));
                    }
		}
	    }

	    return {
		nodes : nodes,
		edges : edges,
	    };
	}
};
});
