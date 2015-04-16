(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhSigninForm', ['$state', 'UserService', jhSigninFormDirective]);

  function jhSigninFormDirective($state, UserService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/user/jh-signin-form.html',
      scope: true,
      link: jhSigninFormLink,
      controllerAs: 'vm',
      bindToController: true,
      controller: JhSigninFormCtrl
    };

    function jhSigninFormLink(scope, element) {
      setTimeout(function() {
        $('#inputUsername', element).focus();
      }, 100);
    }

    function JhSigninFormCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.username = null;
      vm.signin = signin;

      function signin(username) {
        UserService.signin(username).then(function (user) {
          if (user) {
            $state.go('home');
          }
        });
      }
    }
  }
})();
