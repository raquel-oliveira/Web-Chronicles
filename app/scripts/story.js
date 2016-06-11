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
      $http.get('show/stories/' + $scope.selected.file).success(function (data) {
               story.setStory($scope.selected);
               $scope.storyPath = story.getFile();
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
      //TODO: Make a check using a service, if not available redirect to "#/play"
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

/*myApp.service('checkStory', ['$http', function ($http) {
  var isValide = false;
    this.nameIsValide = function (name) {
      console.log("to na funcao");
      $http.get('stories/').success(function (data) {
        console.log("fiz http funcao");
        for (var i = 0 ; i < data.length; i++){
          if (data[i].file === name){
            console.log("true ta");
            isValide = true;
          }
        }
        isValide = false;
      });
      return isValide;
    }
  }]);*/
