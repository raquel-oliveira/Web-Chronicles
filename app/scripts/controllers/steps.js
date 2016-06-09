'use strict';
var myApp = angular.module('cApp');

/*myApp.controller('RiddleCtrl', function ($scope, $http) {
  $scope.verifyAnswer = function (answer) {
      $http.get('stories/' + getStoryPath() + '/step/' + getCurrentStep().id + "/reponse/" + answer).then(function (reponse) {
          if (reponse.status === 200) {
              console.log("good anwser");
              console.log(reponse.data);
              console.log("good anwser");
              $scope.goToStep(reponse.data.answer._stepId);
          }
          else {
              console.log(reponse.data);
              console.log("bad anwser");
              $scope.hint = 'Hint : ' + reponse.data.hint;
          }
      });
  };

  $scope.change = function (value) {
      $scope.answer = value;
  };
});
*/

myApp.controller('EndCtrl', function ($scope, $http) {
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

    $http.get('compute/' + $scope.storyPath + '/true').success(function (data) {
	$scope.minSteps = data;
    });
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
