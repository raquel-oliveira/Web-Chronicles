'use strict';

var myApp = angular.module('cApp');

myApp.controller('SetStory', function ($scope, $http){
  $scope.selected = null;
  $scope.storyPath = "";
  $http.get('stories/').success(function (data) {
            $scope.stories = data;
            $scope.selected = $scope.stories[0];
            $scope.storyPath = $scope.selected.file;

        });

    $scope.changeStory = function () {
      $scope.storyPath = $scope.selected.file;
    };
});
