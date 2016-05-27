/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

StatesService.$inject = ['$q', 'RoomService', 'UserService'];

function StatesService($q, RoomService, UserService) {
  /**
   * Sets the current user and room according to params and/or cookies.
   * @param {object} stateParams State parameters.
   */
  this.setRoomAndUser = function(stateParams) {
    var deferred = $q.defer();

    // Set user
    var userName = stateParams.user || UserService.getSetting('lastUsername');
    if (userName !== undefined) {
      UserService.signin(userName);
    }

    // Set room
    var roomId = parseInt(stateParams.room);
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

export default StatesService;
