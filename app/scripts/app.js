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
        templateUrl: 'views/play.html',
        controller: 'PlayCtrl',
        controllerAs: 'play'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
