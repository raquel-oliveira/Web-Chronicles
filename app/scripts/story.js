'use strict';

var myApp = angular.module('cApp');

myApp.controller('SetStory', function ($scope, $http, story, $routeParams){
  $scope.selected = null;
  $http.get('stories/').success(function (data) {
            $scope.stories = data;
            if ($routeParams.story === undefined){
              console.log("primeiro da lista");
              $scope.selected = $scope.stories[0];
              story.setStory($scope.selected);
            }else{
              story.setFile($routeParams.story);
              $scope.startStory();
            }
        });

    $scope.changeStory = function () {
      $http.get('show/stories/' + $scope.selected.file).success(function (data) {
               story.setStory($scope.selected);
               console.log(story.get());
           });
       };
});

myApp.factory('story', function($http){
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
      var check = false;
      $http.get('stories/').success(function (data) {
        for (var i = 0 ; i < data.length; i++){
          if (data[i].file === f){
            story = data[i];
            check = true;
          }
        }
        if(check === false){
          alert("This is story is not available!");
        }
      });
    },
    getName: function () {
      return story.label;
    }
  }
});
