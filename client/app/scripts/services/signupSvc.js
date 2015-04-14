'use strict';

angular.module('clientApp')
  .factory('signupSvc', function (Restangular) {

    function addUser(email, password){
      console.log(email);
      var newUser = Restangular.all("addUser");
      return newUser.post({email: email, password: password});
    }

    return {
      addUser: addUser
    };
  });
