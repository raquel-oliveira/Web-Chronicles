'use strict';

var x2js = new X2JS();

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # ShowCtrl
 */
angular.module('cApp')
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('xmlHttpInterceptor');
    })
    .controller('ShowCtrl', ['$scope', '$http', 'ShortestPathService', function ($scope, $http) {
        $scope.selected = null;
        $scope.stories = null;
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

	    var shape = (nodes.length == 0)? 'box': 'ellipse';
		
            nodes.add({
                id: id,
                label: id,
		color: color,
		font: { color: fontColor },
		shape: shape
            });
	}

	
        $scope.updateGraph = function (data) {
	    var nodes = new vis.DataSet([]);
            var edges = new vis.DataSet([]);
            var story = data.story;

            for (var i = 0; i < story.step.length; ++i) {
                if (story.step[i].content[0].type[0] === 'multiple_choice') {
		    addNode(nodes, parseInt(story.step[i].content[0].id));

                    for (let j = 0; j < story.step[i].content[0].nextStep.length; ++j) {
                        addEdge(edges, parseInt(story.step[i].content[0].id), parseInt(story.step[i].content[0].nextStep[j]._));
                    }
                } else if (story.step[i].content[0].type[0] === 'end') {
                    var color = (story.step[i].content[0].win[0] === 'false') ?
                        '#882222' : '#228822';

		    addNode(nodes, parseInt(story.step[i].content[0].id), color, "#FFFFFF");
                } else if (story.step[i].content[0].type[0] === 'riddle') {
		    addNode(nodes, parseInt(story.step[i].content[0].id));

                    for (let j = 0; j < story.step[i].hiden[0].answer.length; ++j) {
                        addEdge(edges, parseInt(story.step[i].content[0].id), parseInt(story.step[i].hiden[0].answer[j].$.stepId));
                    }
                } else if (story.step[i].content[0].type[0] === 'maze') {
		    addNode(nodes, parseInt(story.step[i].content[0].id));
                    addEdge(edges, parseInt(story.step[i].content[0].id), parseInt(story.step[i].content[0].nextStep[0]._));
                } else {
		    addNode(nodes, parseInt(story.step[i].content[0].id));
                }
            }
	    
            $http.get('compute/' + $scope.selected.file + '/false').then(function (spData) {
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
                }
                else {
                    $scope.network.setData(data);
                }

                $scope.network.on("selectNode", function (params) {
                    $scope.$apply(function () {
                        if (!$scope.showDatas) {
                            $scope.showDatas = true;
                        }
                    });

                    var id = params.nodes[0];
                    var step;

                    for (var i = 0; i < story.step.length; ++i) {
                        if (parseInt(story.step[i].content[0].id) === id) {
                            step = story.step[i];
                        }
                    }

                    $scope.$apply(function () {
                        $scope.step = step;
                        $scope.url = 'views/show-' + step.content[0].type[0] + '.html';
                    });
                });


            });

        };

        $scope.initStory = function (story_file) {
            $http.get(story_file).success(function (data) {
                $scope.updateGraph(data);
            });
        };

        $http.get('stories/').success(function (data) {
            $scope.initStory('show/stories/' + data[0].file);
            $scope.stories = data;
            $scope.selected = $scope.stories[0];
        });

        $scope.changeStory = function () {
	    $scope.network.off('selectNode');
	    $scope.showDatas = false;
            $http.get('show/stories/' + $scope.selected.file).success(function (data) {
                $scope.updateGraph(data);
            });
        };
    }]);
