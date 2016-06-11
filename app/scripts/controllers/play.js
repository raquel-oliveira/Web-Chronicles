'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', function ($scope, $http, $sce, story, checkStory, $routeParams){
      //variables
      $scope.nbSteps = 0;
      $scope.currentStep = null;

      //TODO: Need to implement check of parameter, for now, its show an alert in setFile
      story.setFile($routeParams.story);
      $scope.storyName = story.getName();
      $scope.goToStep(0); //start from 0.
      /*var a;
      //var result = checkStory.nameIsValide($routeParams.story);
      var result = checkStory.nameIsValide($routeParams.story).then(function (result) {
      a = result;
    });
      console.log("hahahah");
      console.log(result);
      console.log(a);*/

      /* Definition of functions */

      // Go to the step after click in "next"
      $scope.goToStep = function (step) {
        if (undefined != step) {
          $scope.cleanLastStep();
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

      // Clean data related to last step
      $scope.cleanLastStep = function () {
        $scope.currentStep = null;
      };

});
