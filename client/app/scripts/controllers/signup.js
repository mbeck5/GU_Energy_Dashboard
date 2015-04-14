'use strict';

angular.module('clientApp')
  .controller('SignupCtrl', function ($scope, $modalInstance, signupSvc) {

    $scope.ok = function(email, password, passwordConfirm){
      if(properDomain(email)) {
        if (password === passwordConfirm) {
          signupSvc.addUser(email, password).then(function (data) {
              if(typeof data.code === 'undefined'){
                $modalInstance.close(true);
              }
              else if(data.code === 'ER_DUP_ENTRY'){
                alert("User already exists");
                clearInputs();
              }
              else{
                alert("Error! Please contact someone");
                clearInputs();
              }
            }
          );
        }
        else {
          alert("Passwords don't match");
        }
      }
      else{
        alert("Please enter a valid Gonzaga University email");
        clearInputs();
      }
    };

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    };

    function properDomain(email){
      var properDomains = ["gonzaga.edu", "zagmail.gonzaga.edu"];
      var domain = email.split("@")[1];
      if(properDomains.indexOf(domain) == -1){
        return false;
      }
      else{
        return true;
      }
    };

    function clearInputs(){
      $scope.email = "";
      $scope.password = "";
      $scope.passwordConfirm = "";
    }
  });
