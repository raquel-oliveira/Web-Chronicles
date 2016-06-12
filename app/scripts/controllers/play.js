'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', ['$scope', '$http', '$sce', '$routeParams', '$location', function ($scope, $http, $sce, $routeParams, $location){
      //variables
      $scope.nbSteps = 0;
      $scope.currentStep = null;
      $scope.view = "play";

      // Go to the step after click in "next"
      $scope.goToStep = function (step) {
        if (undefined !== step) {
          $scope.currentStep = null; // Clean data related to last step
          $http.get('play/' + $routeParams.story + '/' + step).success(function (data) {
            $scope.currentStep = data;
            $scope.currentStep.url = 'views/play_step/' + data.type + '.html';
            $scope.stepType = data.type;
            $scope.htmlDesc = $sce.trustAsHtml(data.description);
            ++$scope.nbSteps;
          });
        } else {
          alert("Choose an option");
        }
      };

      if($routeParams.story !== undefined){
        $http.get('stories/').then(
          function (data) {
            var check = false;
            for (var i = 0 ; i < data.data.length; i++){
              if (data.data[i].file === $routeParams.story){
                check = true;
                $scope.storyName = data.data[i].label;
                $scope.goToStep(0); //start from 0.
              }
            }
            if(check === false){
              $location.path('/');
              $location.replace();
            }
          },
          function(){
            $location.path('/');
            $location.replace();
            });
          }
}]);
