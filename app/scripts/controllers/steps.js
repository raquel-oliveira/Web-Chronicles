'use strict';
var myApp = angular.module('cApp');

/*myApp.controller('RiddleCtrl', function ($scope, $http) {
  $scope.verifyAnswer = function (answer, sharedStory) {

      $http.get('stories/' + sharedStory.getStoryPath() + '/step/' + sharedStory.getCurrentStep().id + "/reponse/" + answer).then(function (reponse) {
          if (reponse.status === 200) {

              $scope.goToStep(reponse.data.answer._stepId);
          }
          else {

              $scope.hint = 'Hint : ' + reponse.data.hint;

          }
      });
  };

  $scope.change = function (value) {
      $scope.answer = value;
  };
});*/


myApp.controller('EndCtrl', function ($scope) {
       if ( $scope.currentStep.win === 'true') {
         $scope.showStory = true;
         $scope.tryAgain = false;
         $scope.win = "You win";
         $scope.winStyle = { 'font-size': '100px', 'text-align': 'center', 'color': 'green'};
       } else{
         $scope.showStory = false;
         $scope.tryAgain = true;
         $scope.win = "You lose";
         $scope.winStyle = { 'font-size': '100px','text-align': 'center', 'color': 'red'};
     }
 });

 /*myApp.controller('MCCtrl', function ($scope) {
   $scope.optionsRadio = false;
   $scope.showRadio = function (){
        if ($scope.currentStep.type === 'multiple_choice'){
          if ( $scope.currentStep.nextStep.length === 1){
            $scope.optionsRadio = false;
          }else{
            $scope.optionsRadio = true;
          }
          console.log("aaaaaa"+ $scope.currentStep.nextStep.length);
        }
      };
  });*/
