'use strict';
var myApp = angular.module('cApp');

myApp.controller('RiddleCtrl', function ($scope, $http,story) {
    $scope.verifyAnswer = function (answer) {
        $http.get('play/stepAction/' + story.getFile() + "/" + $scope.currentStep.id +
            '/verifyAnswer/' + answer).then(function (reponse) {
            if (reponse.data.correct === true) {
                $scope.goToStep(reponse.data.nextStep);
            }
            else {
                $scope.hint = reponse.data.hint;
                $scope.showhint = true;
                $scope.distance = reponse.data.distance;
                $scope.hint.close = 'Not even close';

                if ($scope.distance < 2) {
                    $scope.hint.close = 'Hot as the sun';
                }
                else if ($scope.distance < 4) {
                    $scope.hint.close = 'Warm';
                }
                else if ($scope.distance < 6) {
                    $scope.hint.close = 'Try harder';
                }
                else if ($scope.distance < 10) {
                    $scope.hint.close = 'Cold';
                }
                else if ($scope.distance < 15) {
                    $scope.hint.close = 'Frozen';
                }
            }
        });
    };

    $scope.change = function (value) {
        $scope.answer = value;
    };
});


myApp.controller('EndCtrl', function ($scope, $http) {
    if ($scope.currentStep.win === true) {
        $scope.showStory = true;
        $scope.tryAgain = false;
        $scope.winT = true;
        $scope.win = "You win";
        $scope.winStyle = {'color': 'green'};
    } else {
        $scope.showStory = false;
        $scope.winT = false;
        $scope.tryAgain = true;
        $scope.win = "You lose";
        $scope.winStyle = {'color': 'red'};
    }


    $http.get('compute/' + $scope.storyPath + '/true').success(function (data) {
        $scope.minSteps = data;

    });
});

myApp.controller('MCCtrl', function ($scope) {
    $scope.optionsRadio = true;
    if ($scope.currentStep.outcomes.length === 1) {
        $scope.optionsRadio = false;
        $scope.selectedAnswer = $scope.currentStep.outcomes[0].nextStep;
    }
    else {
        $scope.optionsRadio = true;
    }

});
