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
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'restangular',
    'ui.bootstrap',
    'nvd3'
  ])
  .config(function ($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('/api/');
    $routeProvider
      .when('/', {
        templateUrl: 'views/buildingSelector.html',
        controller: 'BuildingSelectorCtrl'
      })
      .when('/buildings/:building', {
        templateUrl: 'views/buildingDisplay.html',
        controller: 'BuildingDisplayCtrl'
      })
      .when('/Competitions', {
        templateUrl: 'views/compDisplay.html',
        controller: 'CompDisplayCtrl'
        })
      .otherwise({
        redirectTo: '/'
      });
  });

