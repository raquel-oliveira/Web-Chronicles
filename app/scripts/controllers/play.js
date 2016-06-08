'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
      .controller('PlayCtrl', function ($scope, $http) {
		$scope.stories = null;
    	$scope.storyName = null;


		$scope.currentStep = null;

		$scope.choices = null;
		$scope.selected = null;

		$scope.nbSteps = 0;
		$scope.stepId = 0;

		$scope.title = '<Titre>';
		$scope.description = '<Description>';
		//$scope.endStatus = "Number of step : " + $scope.nbSteps + "\n" +"Minimum number of step : <not implemented>";
		$scope.endStatusDisplayed = false;
		$scope.choose = true;
		$scope.play = false;
		$scope.choosed = false;

	$scope.update = function() {

	  $scope.description = $scope.currentStep.description;
	  if ( $scope.currentStep.win === 'true') {
	    $scope.endStatusDisplayed = true;
	  }
	};

  $scope.startStory = function() {
    $scope.choose = false;
    $scope.play = true;
	$scope.storyName = $scope.selected._file;
	$scope.initStory($scope.title);
  };

	$scope.initStory = function(story_file) {
	    /*$http.get(story_file).success(function (data) {
			console.log(data.story);
			$scope.storyName = $scope.stories[0];
			$scope.story = data.story;

			$scope.play = false;

			$scope.goToStep(0);
			$scope.update();
	    });*/
		$scope.storyName = story_file;
		$scope.goToStep(0);
	};

	$scope.goToStep = function(step) {
		$http.get('stories/'+$scope.storyName+'/step/'+step).success(function (data) {
			var content = data.content;
			console.log(data);
			$scope.currentStep = content;
			$scope.currentStep.url = 'views/'+content.type+'.html';
			$scope.choices = content.nextStep;
			$scope.stepType = content.type;

			console.log(content.nextStep);
			$scope.play = true;


			console.log(content);
			console.log($scope.choices);
			++$scope.nbSteps;
			$scope.update();
		});
    };


	$scope.changeStory = function() {
	  $scope.endStatusDisplayed = false;
		console.log($scope.selected);
		$scope.title = $scope.selected._label;
	  //$scope.initStory('stories/' + $scope.selected._file);
	};


	//$scope.initStory('stories/minimal_story.xml');

	var x2js = new X2JS();
	$http.get('stories/').success(function (data) {

	   var raw = x2js.xml_str2json(data);
		$scope.stories = raw.stories.story;
		console.log(data);
		console.log(raw);
		console.dir($scope.stories);
		console.dir($scope.stories[0]);

	  $scope.selected = $scope.stories[0];
	});


  });
