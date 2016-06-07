'use strict';

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
    .controller('ShowCtrl', function ($scope, $http) {
      $scope.storyFile = null;
      $scope.stories = null;
      $scope.network = null;
      
      $scope.updateGraph = function(story) {
	var nodes = new vis.DataSet([]);
	var edges = new vis.DataSet([]);

	for (var i = 0; i < story.step.length; ++i) {
	  if (story.step[i].type === 'multiple_choice') {
	    nodes.add({ id : parseInt(story.step[i]._id),
			label : story.step[i]._title });

	    for (var j = 0; j < story.step[i].nextStep.length; ++j) {
	      edges.add({ from : parseInt(story.step[i]._id),
			  to   : parseInt(story.step[i].nextStep[j])  });
	    }
	  } else if(story.step[i].type === 'end') {
	    var color = (story.step[i].win === 'true')?
		'#882222' : '#228822';

	    nodes.add({ id : parseInt(story.step[i]._id),
			label : story.step[i]._title,
			color : color,
		        font: { color : "#FFFFFF" } });

	  } else {
	    nodes.add({ id : parseInt(story.step[i]._id),
			label : story.step[i]._title });
	  }
	}

	var container = document.getElementById('network-story');

	var data = {
	  nodes: nodes,
	  edges: edges
	};

	var options = { layout : { hierarchical : true } };

	if ($scope.network === null)
	  $scope.network = new vis.Network(container, data, options);
	else
	  $scope.network.setData(data);
      
      };
      
      $scope.initStory = function(story_file) {
 	$http.get(story_file).success(function (data) {
	  console.log(data.story);
	  $scope.updateGraph(data.story);
	});
      };
      
      $scope.initStory('stories/minimal_story.xml');

      $http.get('stories/stories.xml').success(function (data) {
	$scope.stories = data.stories.story;
      });

      $scope.changeStory = function() {
	$http.get('stories/' + $scope.storyFile).success(function (data) {
	  $scope.updateGraph(data.story);
	});
	
	console.log($scope.storyFile);
      }
    });
