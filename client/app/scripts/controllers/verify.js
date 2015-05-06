'use strict';

angular.module('clientApp')
  .controller('VerifyCtrl', function ($scope, $location, signupSvc) {
    verify();

    //Gets the information from the link sent in the email to verify the user.
    function verify(){
      var url = $location.url();
      var params = url.substring(url.indexOf("?") + 1).split('&');
      var email = params[0].substring(params[0].indexOf("=") + 1);
      var token = params[1].substring(params[1].indexOf("=") + 1);
      signupSvc.confirmUser(email, token).then(function(){
        var host = $location.host();
        $location.url(host);
      });
    }
  });
