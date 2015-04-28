'use strict';

angular.module('clientApp')
  .factory('signupSvc', function (Restangular) {

    function addUser(email, password){
      var newUser = Restangular.all("addUser");
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
      addUser: addUser,
      confirmUser: confirmUser,
      addUserPassword: addUserPassword
    };
  });
