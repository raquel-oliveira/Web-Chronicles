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
      $http.get('stories/').success(function (data) {
        for (var i = 0 ; i < data.length; i++){
          if (data[i].file === f){
            story = data[i];
            console.log("setei");
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


myApp.factory('check', function($http, $location){
  return {
    checkStory: function(f){
      var check = false;
      $http.get('stories/').success(function (data) {
        for (var i = 0 ; i < data.length; i++){;
          if (data[i].file === f){
            console.log("setei");
            check = true;
            return data[i];
          }
        }
        if(check === false){
          console.log("faaalso antes de vir ao menu");
          $location.path('/');
          $location.replace();
          console.log("vou retornar falso");
          return false;
        }
      });
    }
  }
});
