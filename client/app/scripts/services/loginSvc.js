'use strict';

angular.module('clientApp')
  .factory('loginSvc', function (Restangular) {
    var user = "";

    function getUser(email){
      var user = Restangular.all("getUser");
      return user.getList({email: email});
    }

    function getPassword(email){
      var password = Restangular.all("getPassword");
      return password.getList({email: email});
    }

    return {
      getUser: getUser,
      getPassword: getPassword
    };
  });
