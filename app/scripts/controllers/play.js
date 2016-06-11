'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', function ($scope, $http, $sce) {
        $scope.nbSteps = 0;
        // Story
        $scope.stories = null; // list of stories
        $scope.storyPath = null; // path of story selected

        // Current step
        $scope.currentStep = null;
        //Divs of type ng-show in play.html
        $scope.choose = false; // Choose a story to start
        $scope.play = false; // Body of the story based on the step.html
        $scope.endStatusDisplayed = false;

        /*After a story is choosed*/
        $scope.startStory = function () {
            $scope.choose = false; //disable view to choose a story
            $scope.play = true;
            $scope.storyPath = $scope.selected;
            $scope.goToStep(0); // start from root
        };

        /* Go to the step after click in "next" */
        $scope.goToStep = function (step) {
            if (undefined != step) {
                $scope.cleanLastStep();
                $http.get('stories/' + $scope.selected + '/step/' + step).success(function (data) {

                    console.dir(data);
                    $scope.currentStep = data;
                    $scope.currentStep.url = 'views/play_step/' + data.type[0] + '.html';
                    $scope.stepType = data.type[0];
                    $scope.play = true;
                    $scope.htmlDesc = $sce.trustAsHtml(data.description[0]);

                    ++$scope.nbSteps;
                });
            } else {
                alert("Choose an option");
            }
        };

        // Clean data related to last step
        $scope.cleanLastStep = function () {
            $scope.currentStep = null;

        };

        $http.get('stories/').success(function (data) {
            $scope.stories = data;
            $scope.choose = true;
            $scope.selected = $scope.stories[0];
            $scope.play = false;
            /*console.dir(data);
             $scope.stories = data;
             console.dir($scope.stories );
             $scope.choose = true;
             $scope.selected = $scope.stories[0];
             $scope.play = false;*/
        });
    });
