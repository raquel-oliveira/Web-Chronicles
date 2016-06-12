'use strict';

var myApp = angular.module('cApp');

myApp.controller('SetStory', function ($scope, $http, story){
  $scope.selected = null;
  $scope.storyPath = "";
  $http.get('stories/').success(function (data) {
            $scope.stories = data;
            $scope.selected = $scope.stories[0];
            story.setStory($scope.selected);
            $scope.storyPath = story.getFile();

        });

    $scope.changeStory = function () {
      story.setStory($scope.selected);
      $scope.storyPath = story.getFile();
    };
});

myApp.factory('story', function($http, $location){
  var story = {"file": "win", "label":"Want to win ?"};
  return {
    setStory: function (st){
      story = st;
      story.file = st.file;
    },
    get: function(){
      return story;
    },
    getFile: function(){
      return story.file;
    },
    setFile: function(f){
      //TODO: Make a check using a service, if not available redirect to "#/main"
      var check = false;
      $http.get('stories/').then(function (data) {
        for (var i = 0 ; i < data.data.length; i++){
          if (data.data[i].file === f){
            story = data.data[i];
            check = true;
          }
        }
        if(check === false){
          $location.path('/');
          $location.replace();
        }
      });
    },
    getName: function () {
      return story.label;
    }
  }
});
