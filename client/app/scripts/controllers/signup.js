'use strict';

angular.module('clientApp')
  .controller('SignupCtrl', function ($scope, $modalInstance, signupSvc) {

    $scope.ok = function(email, password, passwordConfirm){
      if(properDomain(email)) {
        if (password === passwordConfirm) {
          signupSvc.addUserEmail(email).then(function (data) {
              if(typeof data.code === 'undefined'){

                var salt = data[0];

                //create hash
                try {
                  var bcrypt = new bCrypt();
                  bcrypt.hashpw(password, salt, function (hash) {
                    //send hash to create password
                    signupSvc.addUserPassword(email, hash);
                    alert("A confirmation email has been sent to your entered email address.  Please verify your email to access full functionality.");
                  });
                }
                catch (err) {
                  alert (err);
                }
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
      return properDomains.indexOf(domain) != -1;
    }

    function clearInputs(){
      $scope.email = "";
      $scope.password = "";
      $scope.passwordConfirm = "";
    }
  });
