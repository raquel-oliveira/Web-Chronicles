'use strict';

 var myApp = angular.module('cApp');
myApp.controller('ShowRiddleCtrl', function ($scope) {

    $scope.$watch($scope.step, function () {
	if (Array.isArray($scope.step.hiden.answer)) {
	    $scope.answers = $scope.step.hiden.answer;
	} else {
	    $scope.answers = [ $scope.step.hiden.answer ];
	}
	console.log($scope.answers);
    }, true);
});
