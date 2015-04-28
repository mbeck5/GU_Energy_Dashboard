'use strict';

angular.module('clientApp')
  .factory('signupSvc', function (Restangular) {

    function addUserEmail(email, password){
      var newUser = Restangular.all("addUserEmail");
      return newUser.post({email: email, password: password});
    }

    function confirmUser(email, token){
      var confirm = Restangular.all("confirmUser");
      return confirm.post({email: email, token: token});
    }

    function addUserPassword(email, hash) {
      var post = Restangular.all('addUserPassword');
      post.post({email: email, hash: hash});
    }

    return {
      addUserEmail: addUserEmail,
      confirmUser: confirmUser,
      addUserPassword: addUserPassword
    };
  });
