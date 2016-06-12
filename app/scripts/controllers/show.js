'use strict';

var x2js = new X2JS();

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # ShowCtrl
 */
angular.module('cApp')
    .controller('ShowCtrl', ['$scope', '$http', '$routeParams', 'graph', '$location' function ($scope, $http, $routeParams, graph, $location) {
        $scope.view = "show";
        $scope.storyName = null;
        $scope.network = null;
        $scope.graphStyle = {
            "height": "400px",
            "border": "1px solid grey"
        };

        $scope.showDatas = false;
        $scope.hasShortestPath = true;

        $scope.updateGraph = function (story) {
	    var graphData = graph.getGraphData(story);
	    var nodes = graphData.nodes;
            var edges = graphData.edges;

            $http.get('shortestPath/' + $routeParams.story + '/false').then(function (spData) {
                if (spData.data.length > 0) {
                    $scope.hasShortestPath = true;
                } else {
                    $scope.hasShortestPath = false;
                }

                var edgesData = edges.get();
                for (var i = 0; i < spData.data.length - 1; ++i) {
                    for (var j = 0; j < edgesData.length; ++j) {
                        if (parseInt(spData.data[i]) === edgesData[j].from &&
                            parseInt(spData.data[i + 1]) === edgesData[j].to) {
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

            for (var i = 0; i < story.steps.length; ++i) {
                if (parseInt(story.steps[i].id) === node) {
                    step = story.steps[i];
                }
            }
	    console.log(step);
	    $scope.outcomes = step.outcomes;

	    $scope.step = step;
            $scope.url = 'views/show-' + step.type + '.html';
	};

    if($routeParams.story !== undefined){
	$http.get('show/story/'+ $routeParams.story).then(function (data) {
    console.log(data);
            $scope.updateGraph(data.data);
            $scope.storyName = data.data.name;
      }, function(){
        $location.path('/');
        $location.replace();
      });
    }
}]);
