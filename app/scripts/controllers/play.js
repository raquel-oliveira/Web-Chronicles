'use strict';

/**
 * @ngdoc function
 * @name cApp.controller:PlayCtrl
 * @description
 * # PlayCtrl
 */
angular.module('cApp')
    .controller('PlayCtrl', function ($scope, $http) {
        $scope.stories = null;
        $scope.storyName = null;
        $scope.storyPath = null;

        $scope.currentStep = null;

        $scope.choices = null;
        $scope.selected = null;
        $scope.answer = "";
        $scope.nbSteps = 0;
        $scope.stepId = 0;

        $scope.title = '<Titre>';
        $scope.description = '<Description>';


        $scope.endStatusDisplayed = false;
        $scope.choose = true;
        $scope.play = false;
        $scope.choosed = false;

        $scope.update = function () {

            $scope.description = $scope.currentStep.description;
            if ($scope.currentStep.win === 'true') {
                $scope.endStatusDisplayed = true;
            }
        };

        $scope.startStory = function () {
            $scope.choose = false;
            $scope.play = true;
            $scope.storyName = $scope.selected.name;
            $scope.storyPath = $scope.selected._file;

            $scope.goToStep(0);
        };


        $scope.goToStep = function (step) {
            $http.get('stories/' + $scope.storyPath + '/step/' + step).success(function (data) {
                console.log('stories/' + $scope.storyPath + '/step/' + step)
                var content = data.content;
                console.log(data);

                $scope.currentStep = content;
                $scope.currentStep.url = 'views/' + content.type + '.html';
                $scope.choices = content.nextStep;
                $scope.stepType = content.type;

                //console.log(content.nextStep);
                $scope.play = true;


                console.log(content);
                //console.log($scope.choices);
                ++$scope.nbSteps;
                $scope.update();
            });
        };

        $scope.change = function (value) {
            $scope.answer = value;
        };

        $scope.verifyAnswer = function (answer) {
            $http.get('stories/' + $scope.storyName + '/step/' + $scope.currentStep.id + "/reponse/" + answer).then(function (reponse) {
                if (reponse.status === 200) {
                    console.log("good anwser");
                    console.log(reponse.data);
                    console.log("good anwser");
                    $scope.goToStep(reponse.data.answer._stepId);
                }
                else {
                    console.log(reponse.data);
                    console.log("bad anwser");
                    $scope.hint = 'Hint : ' + reponse.data.hint;
                }
            });
        };

        $scope.changeStory = function () {
            //$scope.endStatusDisplayed = false;
            console.log($scope.selected);
            $scope.title = $scope.selected._label;

        };

        var x2js = new X2JS();
        $http.get('stories/').success(function (data) {

            var raw = x2js.xml_str2json(data);
            $scope.stories = raw.stories.story;
            console.log(data);
            console.log(raw);
            console.dir($scope.stories);
            console.dir($scope.stories[0]);

            $scope.selected = $scope.stories[0];
        });

    });
