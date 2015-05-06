'use strict';

angular.module('clientApp')
  .controller('HeaderCtrl', function ($scope, $location, $cookies, $rootScope) {
        updateHeader();
        $scope.$on("login", function(){
          updateHeader();
        });
        $scope.navbarCollapsed = true;

    //returns which page is current selected
    $scope.isActive = function (location) {
      return location === $location.path();
    };

        $scope.toggleCollapse = function() {
          //don't toggle if large screen
          if ($(document).width() < 992)
            $scope.navbarCollapsed = !$scope.navbarCollapsed;
        };

        //when logging out, updates all the cookies
        $scope.logout = function(){
          $cookies['loggedIn'] = false;
          $cookies['user'] = '';
          $rootScope.$broadcast("logout");
          updateHeader();
        };

        //Add/Removes the logout button from the header.
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
