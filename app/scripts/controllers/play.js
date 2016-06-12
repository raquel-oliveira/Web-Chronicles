'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', ['$scope', '$http', '$sce', 'story', '$routeParams', function ($scope, $http, $sce, story, $routeParams){
    console.log("initial log");
      //variables
      $scope.nbSteps = 0;
      $scope.currentStep = null;
      $scope.view = "play";

      // Go to the step after click in "next"
      $scope.goToStep = function (step) {
        if (undefined !== step) {
          $scope.currentStep = null; // Clean data related to last step
          $http.get('play/' + story.getFile() + '/' + step).success(function (data) {
          //$http.get('play/' + $routeParams.story + '/' + step).success(function (data) {
            console.log(data);
            //$scope.storyName = data.title;
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
        //console.log("initialp log");
        //story.setFile($routeParams.story);
        //if (check.checkStory($routeParams.story) !== false){
          //console.log("not false");
          //console.log(check.checkStory($routeParams.story));
          //$scope.storyName = check.checkStory($routeParams.story).label;
        //}
        $scope.storyName = story.getName();
        console.log(story.getFile());
        $scope.goToStep(0); //start from 0.
        console.log("finp log");

      }
      console.log("end log");

}]);
