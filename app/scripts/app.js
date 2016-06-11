'use strict';

/**
 * @ngdoc overview
 * @name cApp
 * @description
 * # cApp
 *
 * Main module of the application.
 */
angular
    .module('cApp', [
    'xml',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'AboutCtrl',
        controllerAs: 'contact'
      })
      .when('/play', {
        templateUrl: 'views/chooseStory.html',
        controller: 'SetStory',
        controllerAs: 'play'
      })
      .when('/play/:story', {
        templateUrl: 'views/play.html',
        controller: 'SetStory',
        controllerAs: 'set'
      })
      .when('/show/:story', {
        templateUrl: 'views/show.html',
        controller: 'ShowCtrl',
        controllerAs: 'show'
      })
      .when('/show', {
        templateUrl: 'views/403.html',
        controller: 'ShowCtrl',
        controllerAs: 'show'
      })
      .when('/edit', {
        templateUrl: 'views/edit-step.html',
        controller: 'EditCtrl',
        controllerAs: 'edit'
      })
      .when('/help', {
        templateUrl: 'views/403.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
