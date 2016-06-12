'use strict';
angular.module('cApp').controller('EditCtrl', function ($scope, $http) {
    $scope.step = "";

    $scope.addStep=function(){
        $scope.story.step.push($scope.currentStep);
        console.log('adding a step');
        console.dir($scope.currentStep);
        $scope.currentStep = {};
    };

    $scope.newStory=function(){
        $scope.story = {name:$scope.storyName, file:$scope.storyPath, step:[]};
        console.log('creating story');
        console.dir($scope.story);
    };

    $scope.submitMyForm=function(){
        console.dir('salut');
        /* while compiling form , angular created this object*/
        var data = {story:$scope.story};

        console.dir(data);
        /* post to server*/
        $http.post('/stories/', data);

    };
});
