'use strict';

angular.module('clientApp')
  .controller('LoginCtrl', function ($scope, $cookies, $modal, $modalInstance, $rootScope, loginSvc) {

    $scope.login = function(email, password){
      loginSvc.getUser(email).then(function(data){
        if(data[0]){
          var salt = data[0].salt; //receive hash

          //create hash
          try {
            var bcrypt = new bCrypt();
            bcrypt.hashpw(password, salt, function (hash) {
              //The user exists, check if passwords match
              loginSvc.getPassword(email, hash).then(function(data2){
                if(data2[0]){
                  //Successful Login.
                  $cookies['loggedIn'] = 'true';
                  $cookies['user'] = email;
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
            });
          }
          catch (err) {
            alert (err);
          }
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
