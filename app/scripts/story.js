'use strict';

var myApp = angular.module('cApp');

myApp.controller('SetStory', function ($scope, $http, story){
  $scope.selected = null;
  $http.get('stories/').success(function (data) {
            $scope.stories = data;
            $scope.selected = $scope.stories[0];
            story = $scope.selected;
            console.log(story);
        });

    $scope.changeStory = function () {
      $http.get('show/stories/' + $scope.selected.file).success(function (data) {
               story = $scope.selected;
               console.log(story);
           });
       };
});

myApp.value('story', 0);
