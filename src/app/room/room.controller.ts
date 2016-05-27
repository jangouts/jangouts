/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

RoomCtrl.$inject = ['$scope', '$state', 'blockUI', 'UserService', 'RoomService',
  'hotkeys'];

function RoomCtrl($scope, $state, blockUI, UserService, RoomService, hotkeys) {
  var room = RoomService.getRoom();
  var user = UserService.getUser();
  var params = {};

  if (room === null || user === null) {
    // Redirect to signin making sure room is included in the url
    if (room !== null) {
      params.room = room.id;
    }
    $state.go('signin', params);
  } else {
    if ($state.params.user === undefined) {
      // Make sure the url includes the user (to allow bookmarking)
      params.room = room.id;
      params.user = user.username;
      $state.go($state.current.name, params, {location: 'replace'});
    } else {
      RoomService.enter(user.username);
    }
  }

  $scope.$on('room.error', function(evt, error) {
    // FIXME: do something neat
    alert("Janus server reported the following error:\n" + error);
  });

  $scope.$on('consentDialog.changed', function(evt, open) {
    if (open) {
      blockUI.start();
    } else if (!open) {
      blockUI.stop();
    }
  });

  hotkeys.bindTo($scope)
    .add({
      combo: 'alt+m',
      description: 'Mute or unmute your microphone',
      callback: function() { RoomService.toggleChannel('audio'); }
    })
    .add({
      combo: 'alt+n',
      description: 'Disable or enable camera',
      callback: function() { RoomService.toggleChannel('video'); }
    })
    .add({
      combo: 'alt+q',
      description: 'Sign out',
      callback: function() { UserService.signout(); }
    });
  $scope.hotkeys = hotkeys;
}

export default RoomCtrl;
