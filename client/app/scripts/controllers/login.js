'use strict';

angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $location, loginSvc) {

    $scope.login = function(){
      loginSvc.getUser($scope.studentId).then(function(data){
        if(data.length == 1){
          //The user exists, check if passwords match
          loginSvc.getPassword($scope.studentId).then(function(data2){
            if(data2[0].password === $scope.password){
              //Successful Login.  Redirect to original page, keep the session.
              console.log("success");
              $location.path('/');
            }
            else{
              //Wrong password entered.
              console.log("Wrong Password");
            }
          });
        }
        else{
          //Wrong username entered.
          console.log("Wrong Username");
        }
      });
    };
  });
