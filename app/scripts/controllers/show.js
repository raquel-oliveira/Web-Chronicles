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
    .controller('ShowCtrl', ['$scope', '$http', 'ShortestPathService', function ($scope, $http, shortestPath) {
        $scope.selected = null;
        $scope.stories = null;
        $scope.network = null;
        $scope.graphStyle = {"height": "400px",
			     "border": "1px solid grey"};
	$scope.showDatas = false;

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
			for (var j = 0; j < story.step[i].content.nextStep.length; ++j) {
                            edges.add({
				from: parseInt(story.step[i].content.id),
				to: parseInt(story.step[i].content.nextStep[j]),
				arrows: { to: true }
                            });
			}
		    } else {
			edges.add({
			    from: parseInt(story.step[i].content.id),
			    to: parseInt(story.step[i].content.nextStep)
			});
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
                        label: story.step[i].content.title
                    });

                    if (Array.isArray(story.step[i].hiden.answer)) {
                        for (var j = 0; j < story.step[i].hiden.answer.length; ++j) {
                            edges.add({
                                from: parseInt(story.step[i].content.id),
                                to: parseInt(story.step[i].hiden.answer[j].__text),
				arrows: { to: true }
                            });
                        }
                    } else {
                        edges.add({
                            from: parseInt(story.step[i].content.id),
                            to: parseInt(story.step[i].hiden.answer._stepId),
			    arrows: { to: true }
                        });
                    }

                } else {
                    nodes.add({
                        id: parseInt(story.step[i].content.id),
                        label: story.step[i].content.title
                    });

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

            shortestPath.get(nodes, edges);
	    //console.log($scope.network.getScale());
	    $scope.network.focus("0", {scale: 3});
	    //console.log($scope.network.getScale());

	    $scope.network.on("selectNode", function(params) {
		$scope.$apply(function () {
		    if (! $scope.showDatas) $scope.showDatas = true;
		});

		var id = params.nodes[0];
		var step;

		for (var i = 0; i < story.step.length; ++i) {
		    if (story.step[i].content.id == id) {
			step = story.step[i];
		    }
		}

		$scope.$apply(function () {
		    $scope.step = step;
		    $scope.url = 'views/show-' + step.content.type + '.html';
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
            $http.get('show/stories/' + $scope.selected._file).success(function (data) {
                $scope.updateGraph(data.story);
            });
        };
    }]);
