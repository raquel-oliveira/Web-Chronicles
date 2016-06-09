'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', function ($scope, $http){
        $scope.nbSteps = 0;
        // Story
        $scope.stories = null; // list of stories
        $scope.storyPath = null; // path of story selected

        // Current step
        $scope.currentStep = null;
        $scope.description = '<Description>'; // description of the current step

        //Divs of type ng-show in play.html
        $scope.choose = false ; // Choose a story to start
        $scope.play = false; // Body of the story based on the step.html
        $scope.endStatusDisplayed = false;

        // Create function
        /* Update the view to the current step*/
        $scope.update = function () {
            $scope.description = $scope.currentStep.description; //update description of step if available
            if ($scope.currentStep.win === 'true') { //maybe change this to controller 'EndCtrl'
                $scope.endStatusDisplayed = true;
            }
        };


        /*After a story is choosed*/
        $scope.startStory = function () {
          $scope.choose = false; //disable view to choose a story
          $scope.play = true;
          $scope.storyPath = $scope.selected._file;
          $scope.goToStep(0); // start from root
        };

        /* Go to the step after click in "next" */
        $scope.goToStep = function (step) {
          $scope.cleanLastStep();
          $http.get('stories/' + $scope.storyPath + '/step/' + step).success(function (data) {
            var content = data.content;
            $scope.currentStep = content;
            $scope.currentStep.url = 'views/play_step/' + content.type + '.html';$scope.stepType = content.type;
            $scope.play = true;
            ++$scope.nbSteps;
            $scope.update();
            });
        };

        // Clean data related to last step
        $scope.cleanLastStep = function () {
          $scope.currentStep = null;

        };

        var x2js = new X2JS();
        $http.get('stories/').success(function (data) {

            var raw = x2js.xml_str2json(data);
            $scope.stories = raw.stories.story;

            $scope.choose = true;
            $scope.selected = $scope.stories[0];
            $scope.play = false;
        });

});
