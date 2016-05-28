/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from 'lodash';

jhSigninFormDirective.$inject = ['$state', 'RoomService', 'UserService'];

function jhSigninFormDirective($state, RoomService, UserService) {
  return {
    restrict: 'EA',
    template: require('./jh-signin-form.html'),
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
    scope.vm.adjustHeight();
    $(window).on("resize", function() {
      scope.vm.adjustHeight();
    });
  }

  function JhSigninFormCtrl() {
    /* jshint: validthis */
    var vm = this;

    vm.signin = signin;
    vm.adjustHeight = adjustHeight;
    vm.showRoomsList = showRoomsList;
    vm.showRoom = showRoom;

    vm.username = null;
    vm.room = null;
    vm.rooms = [];
    vm.listRooms = null;

    RoomService.getRooms().then(function(rooms) {
      vm.room = RoomService.getRoom();
      vm.rooms = rooms;
      vm.listRooms = vm.room === null;

      if (UserService.getUser() !== null) {
        vm.username = UserService.getUser().username;
      }

      if (vm.room === null) {
        var lastRoomId = UserService.getSetting("lastRoom");
        vm.room = _.find(rooms, function (room: Room) {
          return room.id === lastRoomId;
        });
      }
    });

    function signin() {
      if (vm.room && vm.username){
        $state.go('room', {room: vm.room.id, user: vm.username});
      }
    }

    function showRoomsList() {
      // Return false if it's still null
      return vm.listRooms === true;
    }

    function showRoom() {
      // Return false if it's still null
      return vm.listRooms === false;
    }

    function adjustHeight() {
      var height = $(window).outerHeight() - $("footer").outerHeight();
      $("#signin").css({
        height: height + 'px'
      });
    }
  }
}

export default jhSigninFormDirective;
