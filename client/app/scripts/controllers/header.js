'use strict';

angular.module('clientApp')
  .controller('HeaderCtrl', function ($scope, $location, $cookies, $rootScope) {
        updateHeader();
        $scope.$on("login", function(){
          updateHeader();
        });
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
          $cookies['loggedIn'] = false;
          $cookies['user'] = '';
          $rootScope.$broadcast("logout");
          updateHeader();
        };

        function updateHeader(){
          var isLoggedIn = $cookies['loggedIn'];
          if(isLoggedIn === 'true'){
            $scope.loggedIn = true;
          }
          else{
            $scope.loggedIn = false;
          }
        };
  });
