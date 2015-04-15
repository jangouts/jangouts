(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('SigninController', ['$location', 'UserService', SigninController]);

  function SigninController($location, UserService) {
    /* jshint: validthis */
    var vm = this;
    vm.username = null;
    vm.signin = signin;

    function signin(username) {
      UserService.signin(username).then(function (user) {
        if (user) {
          $location.path('/home');
        }
      });
    }
  }
})();
