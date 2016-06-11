'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', ['$scope', '$http', '$sce', 'story', '$routeParams', function ($scope, $http, $sce, story, $routeParams){

      //variables
      $scope.nbSteps = 0;
      $scope.currentStep = null;
      $scope.view = "play";

      // Go to the step after click in "next"
      $scope.goToStep = function (step) {
        if (undefined !== step) {
          $scope.currentStep = null; // Clean data related to last step
          $http.get('stories/' + story.getFile() + '/step/' + step).success(function (data) {
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
        story.setFile($routeParams.story);
        $scope.storyName = story.getName();
        $scope.goToStep(0); //start from 0.
      }

}]);
