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
        $scope.storyPath = null;
        $scope.optionsRadio = false; //put in the controller MCCtrl
        $scope.selected = null;
        $scope.showPlayButton = false;
        $scope.answer = "";
        $scope.description = '<Description>';
        $scope.stepId = 0;
        $scope.showhint = false;
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


        /*After a story is choosed*/
        $scope.startStory = function () {
                    $scope.choose = false; //disable view to choose a story
                    $scope.play = true;
                    $scope.storyPath = $scope.selected._file;
                    //sharedStory.setStoryPath($scope.storyPath);
                    $scope.goToStep(0); // start from root
        };

        /* Go to the step after click in "next" */
        $scope.goToStep = function (step) {
            $http.get('stories/' + $scope.storyPath + '/step/' + step).success(function (data) {
                var content = data.content;
                $scope.currentStep = content;
                //sharedStory.setCurrentStep($scope.currentStep);
                $scope.currentStep.url = 'views/' + content.type + '.html';
                $scope.stepType = content.type;
                $scope.play = true;
                ++$scope.nbSteps;
                $scope.update();
            });
        };

        var x2js = new X2JS();
        $http.get('stories/').success(function (data) {

            var raw = x2js.xml_str2json(data);
            $scope.stories = raw.stories.story;

            $scope.choose = true;
            $scope.selected = $scope.stories[0];
            $scope.play = false;
        });
        //Change this to controller RiddleCtrl
        $scope.verifyAnswer = function (answer) {

              $http.get('stories/' + $scope.storyPath + '/step/' +  $scope.currentStep.id + "/reponse/" + answer).then(function (reponse) {

                if (reponse.status === 200) {
                    $scope.showhint = false;
                    $scope.goToStep(reponse.data.answer._stepId);
                }
                else {
                    $scope.showhint = true;
                    $scope.hint = reponse.data.hint;
                    console.log( reponse.data.hint);
                    console.log($scope.hint);
                    $scope.hint.close = 'Not even close';

                    if($scope.hint._distance <2)
                    {
                        $scope.hint.close = 'Hot as the sun';
                    }
                    else if($scope.hint._distance <4)
                    {
                        $scope.hint.close = 'Warm';
                    }
                    else if($scope.hint._distance <6)
                    {
                        $scope.hint.close = 'Try harder';
                    }
                    else if($scope.hint._distance <10)
                    {
                        $scope.hint.close = 'Cold';
                    }
                    else if($scope.hint._distance <15)
                    {
                        $scope.hint.close = 'Frozen';
                    }

                }
            });
        };

        $scope.change = function (value) {
            $scope.answer = value;
        };

        //put in the controller MCCtrl
        $scope.showRadio = function (){
             if ($scope.currentStep.type === 'multiple_choice'){
               if (!Array.isArray($scope.currentStep.nextStep)){
                 $scope.optionsRadio = false;
                 $scope.selectedAnswer = $scope.currentStep.nextStep.__text;
               }else{
                 $scope.optionsRadio = true;
              }
             }
           };
});
