'use strict';

angular.module('clientApp')
  .controller('HeaderCtrl', function ($scope, $location) {
        $scope.isActive = function (location) {
          return location === $location.path();
        };
  });
