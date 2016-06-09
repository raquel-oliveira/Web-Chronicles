'use strict';

var myApp = angular.module('cApp', []);

myApp.service('sharedStory', function(){
  var storyPath = null;
  var currentStep = null;

  return {
    getStoryPath : function(){
      return storyPath;
    },
    getCurrentStep : function(){
      return currentStep;
    },
    setStoryPath : function(value){
      storyPath = value;
    },
    setCurrentStep : function(value){
      currentStep = value;
    }
  };
});
