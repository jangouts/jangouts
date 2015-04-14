(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('SigninController', ['$location', 'UsersService', SigninController]);

  function SigninController($location, UsersService) {
    /* jshint: validthis */
    var vm = this;
    vm.username = null;
    vm.signin = signin;

    function signin(username) {
      UsersService.signin(username).then(function (user) {
        if (user) {
          $location.path('/home');
        }
      });
    }
  }
})();
