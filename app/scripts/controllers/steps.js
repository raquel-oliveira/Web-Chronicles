'use strict';
var myApp = angular.module('cApp');

myApp.controller('RiddleCtrl', function ($scope, $http) {
  $scope.verifyAnswer = function (answer) {
      $http.get('stories/' + $scope.storyPath + '/step/' + $scope.currentStep.id + "/reponse/" + answer).then(function (reponse) {
          if (reponse.status === 200) {
              $scope.goToStep(reponse.data.answer._stepId);
          }
          else {
              $scope.hint = 'Hint : ' + reponse.data.hint;
          }
      });
  };
});


myApp.controller('EndCtrl', function ($scope) {
       if ( $scope.currentStep.win === 'true') {
         $scope.showStory = true;
         $scope.tryAgain = false;
         $scope.win = "You win";
         $scope.winStyle = { 'font-size': '100px', 'color': 'green'};
       } else{
         $scope.showStory = false;
         $scope.tryAgain = true;
         $scope.win = "You lose";
         $scope.winStyle = { 'font-size': '100px', 'color': 'red'};
     }
 });
