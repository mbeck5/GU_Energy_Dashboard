'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
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
        templateUrl: 'views/buildingSelector.html',
        controller: 'BuildingSelectorCtrl'
      })
      .when('/buildings/:building', {
        templateUrl: 'views/buildingDisplay.html',
        controller: 'BuildingDisplayCtrl'
      })
      .when('/test', {
        templateUrl: 'views/test.html',
        controller: 'TestCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  });

