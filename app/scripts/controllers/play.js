'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', ['$scope', '$http', '$sce', 'story', '$routeParams', function ($scope, $http, $sce, story, $routeParams){
      console.log("In controller Play");
      //variables
      $scope.nbSteps = 0;
      $scope.currentStep = null;
      $scope.view = "play";

      //TODO: Need to implement check of parameter, for now, its show an alert in setFile
      if($routeParams.story !== undefined){
        story.setFile($routeParams.story);
        console.log($routeParams.story);
        $scope.storyName = story.getName();
        $scope.goToStep(0); //start from 0.
      }

      /* Definition of functions */

      // Go to the step after click in "next"
      $scope.goToStep = function (step) {
        console.log("the step is:");
        console.log(step);
        if (undefined !== step) {
          $scope.currentStep = null; // Clean data related to last step
          $http.get('stories/' + story.getFile() + '/step/' + step).success(function (data) {
            $scope.currentStep = data;
            $scope.currentStep.url = 'views/play_step/' + data.type[0] + '.html';
            $scope.stepType = data.type[0];
            $scope.htmlDesc = $sce.trustAsHtml(data.description[0]);
            ++$scope.nbSteps;
          });
        } else {
          alert("Choose an option");
        }
      };
}]);
