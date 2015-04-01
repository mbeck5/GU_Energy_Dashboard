'use strict';

angular.module('clientApp')
  .controller('HeaderCtrl', function ($scope, $location, $cookies) {
        $scope.navbarCollapsed = true;

        setupLogin();
        $scope.isActive = function (location) {
          return location === $location.path();
        };

        $scope.toggleCollapse = function() {
          //don't toggle if large screen
          if ($(document).width() < 992)
            $scope.navbarCollapsed = !$scope.navbarCollapsed;
        };


        $scope.logout = function(){
          $scope.toggleCollapse();
          $cookies['loggedIn'] = '';
        };


        function setupLogin(){
          var loggedIn = $cookies['loggedIn'];
          if(loggedIn === 'true'){
            $scope.loginPage = "";
            $scope.loginText = "Logout";
          }
          else{
            $scope.loginPage = "Login"
            $scope.loginText = "Login";
          }
        }
  });
