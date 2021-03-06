'use strict';

angular.module('clientApp')
  .factory('loginSvc', function (Restangular) {
    var user = "";

    function getUser(email){
      var user = Restangular.all("getUser");
      return user.getList({email: email});
    }

    function getPassword(email, hash){
      var compare = Restangular.all("getPassword");
      return compare.getList({email: email, hash: hash});
    }

    function isConfirmed(user){
      var confirmed = Restangular.all("isConfirmed");
      return confirmed.getList({user: user});
    }

    return {
      getUser: getUser,
      getPassword: getPassword,
      isConfirmed: isConfirmed
    };
  });
