'use strict';

 var myApp = angular.module('cApp');
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
