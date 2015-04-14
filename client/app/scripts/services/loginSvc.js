'use strict';

angular.module('clientApp')
  .factory('loginSvc', function (Restangular) {
    var user = "";

    function getUser(email){
      var user = Restangular.all("getUser");
      return user.getList({email: email});
    }

    function getPassword(email, password){
      var compare = Restangular.all("getPassword");
      return compare.getList({email: email, password: password});
    }

    return {
      getUser: getUser,
      getPassword: getPassword
    };
  });
