'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
      .controller('PlayCtrl', function ($scope, $http) {
    	$scope.story = null;
	$scope.stories = null;
	$scope.currentStep = null;
	$scope.choices = null;
	$scope.selected = null;
	$scope.nbSteps = 0;
	$scope.stepId = 0;
	$scope.title = '<Titre>';
	$scope.description = '<Description>';
	$scope.endStatus = "Number of step : " + $scope.nbSteps + "\n" +
	      "Minimum number of step : <not implemented>";
	$scope.endStatusDisplayed = false;
  $scope.choose = true;
  $scope.play = false;
  $scope.choosed = false;

	$scope.update = function() {
	  $scope.title = $scope.story._name;
	  $scope.description = $scope.currentStep.description;
	  if ( $scope.currentStep.win == 'true') {
	    $scope.endStatusDisplayed = true;
	  }
	}

  $scope.startStory = function() {
    $scope.choose = false;
    $scope.play = true;
  }

	$scope.initStory = function(story_file) {
	    $http.get(story_file).success(function (data) {
	  console.log(data.story);
		$scope.story = data.story;
		$scope.currentStep = data.story.step[0];
		$scope.choices = data.story.step[0].nextStep;
    $scope.play = false;

		$scope.update();
	    });
	}

	$scope.goToStep = function(step) {
	    ++$scope.nbSteps;
	    for (var i = 0; i < $scope.story.step.length; ++i) {
        if ($scope.story.step[i]._id == step) {
          $scope.currentStep = $scope.story.step[i];
          $scope.choices = $scope.currentStep.nextStep;
          $scope.update();
        }
      }
    }
	$scope.changeStory = function() {
	  $scope.endStatusDisplayed = false;
	  $scope.initStory('stories/' + $scope.selected._file);
	}


	$scope.initStory('stories/minimal_story.xml');


	$http.get('stories/stories.xml').success(function (data) {
	  $scope.stories = data.stories.story;
	  $scope.selected = $scope.stories[0];
	});

  });
