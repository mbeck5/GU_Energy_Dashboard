'use strict';

angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $cookies, $modal, $modalInstance, $rootScope, loginSvc) {

    $scope.login = function(studentId, password){
      loginSvc.getUser(studentId).then(function(data){
        if(data.length == 1){
          //The user exists, check if passwords match
          loginSvc.getPassword(studentId).then(function(data2){
            if(data2[0].password === password){
              //Successful Login.
              $cookies['loggedIn'] = 'true';
              $rootScope.$broadcast("login");
              $modalInstance.close(true);
            }
            else{
              //Wrong password entered.
              $scope.studentId = '';
              $scope.password = '';
              alert("Incorrect Username or Password");
            }
          });
        }
        else{
          //Wrong username entered.
          $scope.studentId = '';
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
