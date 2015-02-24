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
      .when('/test', {
        templateUrl: 'views/test.html',
        controller: 'TestCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({
      color: '#DFD7CA',
      lines: 11,
      length: 0,
      width: 7,
      radius: 18,
      corners: 1,
      direction: 1,
      speed: 1.1,
      trail: 60,
      shadow: true,
      className: 'spinner',
      top: '50%',
      left: '50%'
    });
  }]);

