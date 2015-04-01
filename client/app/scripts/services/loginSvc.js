'use strict';

angular.module('clientApp')
  .factory('loginSvc', function (Restangular) {
    var user = "";

    function getUser(studentId){
      var user = Restangular.all("getUser");
      return user.getList({studentId: studentId});
    }

    function getPassword(studentId){
      var password = Restangular.all("getPassword");
      return password.getList({studentId: studentId});
    }

    return {
      getUser: getUser,
      getPassword: getPassword
    };
  });
