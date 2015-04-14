'use strict';

angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $cookies, $modal, $modalInstance, $rootScope, loginSvc) {

    $scope.login = function(email, password){
      loginSvc.getUser(email).then(function(data){
        if(data.length == 1){
          //The user exists, check if passwords match
          loginSvc.getPassword(email, password).then(function(data2){
            if(data2[0]){
              //Successful Login.
              $cookies['loggedIn'] = 'true';
              $rootScope.$broadcast("login");
              $modalInstance.close(true);
            }
            else{
              //Wrong password entered.
              $scope.email = '';
              $scope.password = '';
              alert("Incorrect Email or Password");
            }
          });
        }
        else{
          //Wrong username entered.
          $scope.email = '';
          $scope.password = '';
          alert("Incorrect Username or Password");
        }
      });
    };

    $scope.openSignupModal = function(size){
      var signupModal = $modal.open({
        templateUrl: 'signupModal.html',
        controller: 'SignupCtrl',
        size: size
      })

      //signupModal.result.then(function(result){
      //});
    };

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    }
  });
