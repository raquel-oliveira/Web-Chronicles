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
        $scope.graphStyle = {"height": "400px",
			     "border": "1px solid grey"};

	$scope.showDatas = false;
	$scope.hasShortestPath = true;

	function addEdge(edges, from, to) {
            edges.add({
		id: edges.length,
		from: from,
		to: to,
		arrows: { to: true }
            });
	}

        $scope.updateGraph = function (story) {
            var nodes = new vis.DataSet([]);
            var edges = new vis.DataSet([]);

            for (var i = 0; i < story.step.length; ++i) {
                if (story.step[i].content.type === 'multiple_choice') {
                    nodes.add({
                        id: parseInt(story.step[i].content.id),
                        label: story.step[i].content.id
                    });

		    if (Array.isArray(story.step[i].content.nextStep)) {
			for (let j = 0; j < story.step[i].content.nextStep.length; ++j) {
			    addEdge(edges, parseInt(story.step[i].content.id), parseInt(story.step[i].content.nextStep[j]));
			}
		    } else {
			addEdge(edges, parseInt(story.step[i].content.id), parseInt(story.step[i].content.nextStep));
		    }
                } else if (story.step[i].content.type === 'end') {
                    var color = (story.step[i].content.win === 'false') ?
                        '#882222' : '#228822';
                    nodes.add({
                        id: parseInt(story.step[i].content.id),
                        label: story.step[i].content.id,
                        color: color,
                        font: {color: "#FFFFFF"}
                    });

                } else if (story.step[i].content.type === 'riddle') {
                    nodes.add({
                        id: parseInt(story.step[i].content.id),
                        label: story.step[i].content.id
                    });

                    if (Array.isArray(story.step[i].hiden.answer)) {
                        for (let j = 0; j < story.step[i].hiden.answer.length; ++j) {
			    addEdge(edges, parseInt(story.step[i].content.id), parseInt(story.step[i].hiden.answer[j]._stepId));
                        }
                    } else {
			addEdge(edges, parseInt(story.step[i].content.id), parseInt(story.step[i].hiden.answer._stepId));
                    }

                } else if (story.step[i].content.type === 'maze') {
                    nodes.add({
                        id: parseInt(story.step[i].content.id),
                        label: story.step[i].content.id
                    });

		    addEdge(edges, parseInt(story.step[i].content.id), parseInt(story.step[i].content.nextStep));
		} else {
                    nodes.add({
                        id: parseInt(story.step[i].content.id),
                        label: story.step[i].content.id
                    });
                }
            }

	    $http.get('compute/' + $scope.selected._file + '/false').then(function (spData) {
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
			    edges.update({ id : edgesData[j].id, color : 'green', 'width' : 3});
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

		$scope.network.on("selectNode", function(params) {
		    $scope.$apply(function () {
			if (! $scope.showDatas) { $scope.showDatas = true; }
		    });

		    var id = params.nodes[0];
		    var step;

		    for (var i = 0; i < story.step.length; ++i) {
			if (parseInt(story.step[i].content.id) === id) {
			    step = story.step[i];
			}
		    }

		    $scope.$apply(function () {
			$scope.step = step;
			$scope.url = 'views/show-' + step.content.type + '.html';
		    });
		});


	    });

        };

        $scope.initStory = function (story_file) {
            $http.get(story_file).success(function (data) {
                $scope.updateGraph(data.story);
            });
        };

        $http.get('stories/').success(function (data) {
            var raw = x2js.xml_str2json(data);
            $scope.initStory('show/stories/' + raw.stories.story[0]._file);
            $scope.stories = raw.stories.story;
            $scope.selected = $scope.stories[0];
        });

        $scope.changeStory = function () {
	    $scope.network.off('selectNode');
            $http.get('show/stories/' + $scope.selected._file).success(function (data) {
                $scope.updateGraph(data.story);
            });
        };
    }]);
