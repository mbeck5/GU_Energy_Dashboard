'use strict';

angular.module('clientApp')
  .controller('HeaderCtrl', function ($scope, $location) {
        $scope.navbarCollapsed = true;

        $scope.isActive = function (location) {
          return location === $location.path();
        };

        $scope.toggleCollapse = function() {
          $scope.navbarCollapsed = !$scope.navbarCollapsed;
        };
  });
