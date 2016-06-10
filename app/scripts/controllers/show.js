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

        $scope.updateGraph = function (data) {
            var story = data.story;
            console.log('updateGraph');
            console.log(story);
            console.log(story.step);
            var nodes = new vis.DataSet([]);
            var edges = new vis.DataSet([]);

            for (var i = 0; i < story.step.length; ++i) {
                if (story.step[i].content[0].type === 'multiple_choice') {
                    nodes.add({
                        id: parseInt(story.step[i].content[0].id),
                        label: story.step[i].content[0].id
                    });

                    if (Array.isArray(story.step[i].content[0].nextStep)) {
                        for (let j = 0; j < story.step[i].content[0].nextStep.length; ++j) {
                            addEdge(edges, parseInt(story.step[i].content[0].id), parseInt(story.step[i].content[0].nextStep[j]));
                        }
                    } else {
                        addEdge(edges, parseInt(story.step[i].content[0].id), parseInt(story.step[i].content[0].nextStep));
                    }
                } else if (story.step[i].content[0].type === 'end') {
                    var color = (story.step[i].content[0].win === 'false') ?
                        '#882222' : '#228822';
                    nodes.add({
                        id: parseInt(story.step[i].content[0].id),
                        label: story.step[i].content[0].id,
                        color: color,
                        font: {color: "#FFFFFF"}
                    });

                } else if (story.step[i].content[0].type === 'riddle') {
                    nodes.add({
                        id: parseInt(story.step[i].content[0].id),
                        label: story.step[i].content[0].id
                    });

                    if (Array.isArray(story.step[i].hiden[0].answer)) {
                        for (let j = 0; j < story.step[i].hiden[0].answer.length; ++j) {
                            addEdge(edges, parseInt(story.step[i].content[0].id), parseInt(story.step[i].hiden[0].answer[j]._stepId));
                        }
                    } else {
                        addEdge(edges, parseInt(story.step[i].content[0].id), parseInt(story.step[i].hiden[0].answer._stepId));
                    }

                } else if (story.step[i].content[0].type === 'maze') {
                    nodes.add({
                        id: parseInt(story.step[i].content[0].id),
                        label: story.step[i].content[0].id
                    });

                    addEdge(edges, parseInt(story.step[i].content[0].id), parseInt(story.step[i].content[0].nextStep));
                } else {
                    nodes.add({
                        id: parseInt(story.step[i].content[0].id),
                        label: story.step[i].content[0].id
                    });
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
                        $scope.url = 'views/show-' + step.content[0].type + '.html';
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
            $http.get('show/stories/' + $scope.selected.file).success(function (data) {
                $scope.updateGraph(data.story);
            });
        };
    }]);
