'use strict';

angular.module('clientApp')
  .controller('SignupCtrl', function ($scope, $modalInstance, signupSvc) {

    $scope.ok = function(email, password, passwordConfirm){
      if(password === passwordConfirm) {
        signupSvc.addUser(email, password).then(function(data){
            $modalInstance.close(true);
          }
      );
      }
      else{
        alert("Passwords don't match")
      }
    };

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    }
  });
