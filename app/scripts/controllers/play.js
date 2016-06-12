'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', ['$scope', '$http', '$sce', '$routeParams', '$location', function ($scope, $http, $sce, $routeParams, $location){
        //variables
        $scope.nbSteps = 0;
        $scope.currentStep = null;
        $scope.view = "play";

        // Go to the step after click in "next"
        $scope.goToStep = function (step,path) {
            if (undefined !== step) {
                $scope.currentStep = null; // Clean data related to last step
                if(path==undefined)
                {
                    console.log("und");
                    path = 'play/' + $routeParams.story + '/' + step;
                }
                console.log("get path"+path);
                $http.get(path).success(function (data) {
                    console.log("get path success");
                    $scope.currentStep = data;
                    $scope.currentStep.url = 'views/play_step/' + data.type + '.html';
                    $scope.stepType = data.type;
                    $scope.htmlDesc = $sce.trustAsHtml(data.description);
                    ++$scope.nbSteps;
                });
            } else {
                alert("Choose an option");
            }
        };
        if($routeParams.continue !== undefined)
        {
            console.log('want to continue');
        }
        /*
         * Check if the parameter it's a story is path app/stories.
         If yes, start from step 0.
         If no, return to the main page.
         */
        if($routeParams.story !== undefined){
            $http.get('stories/').then(
                function (data) {


                    
                    var check = false;
                    for (var i = 0 ; i < data.data.length; i++){
                        if (data.data[i].file === $routeParams.story){
                            check = true;
                            $scope.storyName = data.data[i].label;
                            console.log("story def");
                            //go to saved step
                            if($routeParams.continue !== undefined)
                            {
                                console.log("have session");

                                console.log($scope.haveSession);
                                console.log($scope.continue);

                                $scope.goToStep(0,'/getLastStep');
                            }
                            else {
                                $scope.goToStep(0); //start from 0.
                            }
                            return;
                        }
                    }
                    if(check === false){
                        $location.path('/');
                        $location.replace();
                    }
                },
                function(){ //just in case.
                    $location.path('/');
                    $location.replace();
                });
        }
    }]);
