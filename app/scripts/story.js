'use strict';

var myApp = angular.module('cApp');

myApp.controller('SetStory', function ($scope, $http, story){
  $scope.selected = null;
  $http.get('stories/').success(function (data) {
            $scope.stories = data;
            $scope.selected = $scope.stories[0];
            story.setStory($scope.selected);
            console.log(story.get());
        });

    $scope.changeStory = function () {
      $http.get('show/stories/' + $scope.selected.file).success(function (data) {
               story.setStory($scope.selected);
               console.log(story.get());
           });
       };
});

myApp.factory('story', function(){
  var story;
  return {
    setStory: function (st){
      story = st;
    },
    get: function(){
      return story;
    }
  }
});
