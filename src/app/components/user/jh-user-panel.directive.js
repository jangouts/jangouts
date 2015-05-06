/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhUserPanel', jhUserPanelDirective);

  jhUserPanelDirective.$inject = ['UserService'];

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
        scope.vm.user = null;
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
