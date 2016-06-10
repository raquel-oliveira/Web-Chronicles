'use strict';

var x2js = new X2JS();

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # ShowCtrl
 */
angular.module('cApp')
    .controller('ShowCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
        $scope.storyName = null;
        $scope.network = null;
        $scope.graphStyle = {
            "height": "400px",
            "border": "1px solid grey"
        };

        $scope.showDatas = false;
        $scope.hasShortestPath = true;

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


        $scope.updateGraph = function (story) {
	    var nodes = new vis.DataSet([]);
            var edges = new vis.DataSet([]);

	    for (var i = 0; i < story.step.length; ++i) {
		var color, fontColor;

		if (story.step[i].type[0] === 'end') {
                    color = (story.step[i].win[0] === 'false') ?
                        '#882222' : '#228822';
		    fontColor = "#FFFFFF";
		}

		addNode(nodes, parseInt(story.step[i].id), color, fontColor);
		
		if (typeof story.step[i].nextStep !== "undefined") {
                    for (let j = 0; j < story.step[i].nextStep.length; ++j) {
                        addEdge(edges, parseInt(story.step[i].id), parseInt(story.step[i].nextStep[j]._));
                    }
		}
	    }

            $http.get('compute/' + $routeParams.story + '/false').then(function (spData) {
                if (spData.data.length > 0) {
                    $scope.hasShortestPath = true;
                } else {
                    $scope.hasShortestPath = false;
                }

                var edgesData = edges.get();
                for (var i = 0; i < spData.data.length - 1; ++i) {
                    for (var j = 0; j < edgesData.length; ++j) {
                        if (parseInt(spData.data[i]) == edgesData[j].from &&
                            parseInt(spData.data[i + 1]) == edgesData[j].to) {
                            edges.update({id: edgesData[j].id, color: 'green', 'width': 3});
                        }
                    }
                }

                var container = document.getElementById('network-story');

                var data = {
                    nodes: nodes,
                    edges: edges
                };

                var options = {layout: {hierarchical: true}};

                if ($scope.network === null) {
                    $scope.network = new vis.Network(container, data, options);
                } else {
                    $scope.network.setData(data);
                }

                $scope.network.on("selectNode", function (params) {
		    $scope.$apply(function() {
			$scope.displayNode(params.nodes[0], story);
		    });
                });
            });
        };

	$scope.displayNode = function(node, story) {
            if (!$scope.showDatas) {
                $scope.showDatas = true;
            }

	    var step;

            for (var i = 0; i < story.step.length; ++i) {
                if (parseInt(story.step[i].id) === node) {
                    step = story.step[i];
                }
            }

	    $scope.step = step;
            $scope.url = 'views/show-' + step.type[0] + '.html';
	};

    if($routeParams.story !== undefined){
	$http.get('show/stories/'+ $routeParams.story).success(function (data) {
            $scope.updateGraph(data);
            $scope.storyName = data.name;
      });
    }
}]);
