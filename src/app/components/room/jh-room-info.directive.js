/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhRoomInfo', jhRoomInfoDirective);

  jhRoomInfoDirective.$inject = ['RoomService'];

  function jhRoomInfoDirective(RoomService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/room/jh-room-info.html',
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: jhRoomInfoCtrl
    };

    function jhRoomInfoCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.name = name;

      function name() {
        return RoomService.getRoom().description;
      }
    }
  }

})();
