/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('StatesService', StatesService);

  StatesService.$inject = ['$q', '$stateParams', 'RoomService', 'UserService'];

  function StatesService($q, $stateParams, RoomService, UserService) {
    /**
     * Sets the current user and room according to params and/or cookies.
     */
    this.setRoomAndUser = function() {
      var deferred = $q.defer();

      // Set user
      // TODO: Read userName from a cookie if not received as param
      var userName = $stateParams.user;
      if (userName !== undefined) {
        UserService.signin(userName);
      }

      // Set room
      var roomId = parseInt($stateParams.room);
      if (Number.isNaN(roomId)) {
        RoomService.setRoom(null);
        deferred.resolve();
      } else {
        RoomService.getRooms().then(function(rooms) {
          var result = _.find(rooms, function(room) { return room.id === roomId; });
          RoomService.setRoom(result || null);
          deferred.resolve();
        });
      }
      return deferred.promise;
    };
  }
})();
