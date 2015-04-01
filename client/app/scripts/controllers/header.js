'use strict';

angular.module('clientApp')
  .controller('HeaderCtrl', function ($scope, $location, $cookies) {
        $scope.navbarCollapsed = true;

        $scope.isActive = function (location) {
          return location === $location.path();
        };

        $scope.toggleCollapse = function() {
          //don't toggle if large screen
          if ($(document).width() < 992)
            $scope.navbarCollapsed = !$scope.navbarCollapsed;
        };

        $scope.logout = function(){
          $cookies['loggedIn'] = '';
        };

        $scope.loggedIn = $cookies['loggedIn'];
        if($scope.loggedIn === 'true'){
          $scope.loggedOut = '';
        }
        else{
          $scope.loggedOut = 'true';
        }
  });
