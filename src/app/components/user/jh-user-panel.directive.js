(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhUserPanel', ['UserService', jhUserPanelDirective]);

  function jhUserPanelDirective(UserService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/user/jh-user-panel.html',
      scope: true,
      link: jhUserPanelLink,
      controller: JhUserPanelCtrl,
      controllerAs: 'vm'
    };

    function jhUserPanelLink(scope) {
      scope.$on('user.set', function(evt, user) {
        scope.vm.user = user;
      });

      scope.$on('user.unset', function() {
        scope.vm.user = null
      });
    }

    function JhUserPanelCtrl() {
      /* jshint: validthis */
      var vm = this;

      vm.user = null;
      vm.signout = signout;

      function signout() {
        UserService.signout();
      }
    }
  }
})();
