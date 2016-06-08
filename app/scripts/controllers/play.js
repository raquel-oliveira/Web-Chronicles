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
        $scope.stories = null;
        $scope.storyName = null;
        $scope.storyPath = null;
        $scope.choices =  null; // list of nextSteps of the step
        $scope.selected = null;
        $scope.showPlayButton = false;
        $scope.answer = "";
        $scope.description = '<Description>';
        $scope.stepId = 0;
        //Var in step.html
        $scope.currentStep = null;
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

        /**/
        $scope.changeStory = function () {
            //$scope.endStatusDisplayed = false;
            //console.log($scope.selected);
        };

        /*After a story is choosed*/
        $scope.startStory = function () {
                    $scope.choose = false; //disable view to choose a story
                    $scope.play = true;
                    $scope.storyName = $scope.selected.name;
                    $scope.storyPath = $scope.selected._file;

                    $scope.goToStep(0); // start from root
        };

        /* Go to the step after click in "next" */
        $scope.goToStep = function (step) {
            $http.get('stories/' + $scope.storyPath + '/step/' + step).success(function (data) {
                //console.log('stories/' + $scope.storyPath + '/step/' + step)
                var content = data.content;
                //console.log(data);

                $scope.currentStep = content;
                $scope.currentStep.url = 'views/' + content.type + '.html';
                $scope.choices = content.nextStep;
                $scope.stepType = content.type;

                //console.log(content.nextStep);
                $scope.play = true;


                console.log(content);
                //console.log($scope.choices);
                ++$scope.nbSteps;
                $scope.update();
            });
        };

        var x2js = new X2JS();
        $http.get('stories/').success(function (data) {

            var raw = x2js.xml_str2json(data);
            $scope.stories = raw.stories.story;
            console.log(data);
            console.log(raw);
            console.dir($scope.stories);
            console.dir($scope.stories[0]);

            $scope.choose = true;
            $scope.selected = $scope.stories[0];
        });
});
