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
    'nvd3',
    'toggle-switch',
    'angularSpinner'
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
      .when('/comparison', {
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
  })
  .config(function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({
      color: '#3E3F3A',
      lines: 11,
      length: 0,
      width: 7,
      radius: 18,
      corners: 1,
      direction: 1,
      speed: 1.1,
      trail: 60,
      shadow: false,
      className: 'spinner',
      top: '40%',
      left: '50%'
    });
  });

