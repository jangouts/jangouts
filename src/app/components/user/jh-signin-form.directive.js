/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhSigninForm', jhSigninFormDirective);

  jhSigninFormDirective.$inject = ['$location', 'RoomService'];

  function jhSigninFormDirective($location, RoomService) {
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
      adjustScreenHeight()
      $(window).on("resize", function() {
        adjustScreenHeight()
      })
    }

    function JhSigninFormCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.username = null;
      vm.room = null;
      vm.rooms = [];
      vm.hiddenOnStart = false;
      vm.signin = signin;

      RoomService.connect().then(function() {
        RoomService.getAvailableRooms().then(function(rooms) {
          vm.rooms = rooms;
        });
      });

      function signin() {
        if (vm.room && vm.username){
            $location.path("/" + vm.username + "/" + vm.room.id);
        }
      }
    }
  }
})();
