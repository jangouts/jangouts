/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl',  MainCtrl);

  MainCtrl.$inject = ['$q', '$scope', '$state', '$stateParams', 'blockUI', 'UserService', 'RoomService',
    'hotkeys'];

  function MainCtrl($q, $scope, $state, $stateParams, blockUI, UserService, RoomService, hotkeys) {
    $scope.enter = enter;

    setRoomAndUser().then(function(){
      $scope.enter();
    }, function(){
      // if setRoomAndUser fails go to signing
      $state.go('signin');
    });

    $scope.$on('room.error', function(evt, error) {
      // FIXME: do something neat
      alert("Janus server reported the following error:\n" + error);
    });

    $scope.$on('user.unset', function() {
      RoomService.leave();
    });

    $scope.$on('consentDialog.changed', function(evt, open) {
      if (open) {
        blockUI.start();
      } else if (!open) {
        blockUI.stop();
      }
    });

    function setRoomAndUser(){
      var deferred = $q.defer();
      var startHidden = $stateParams.startHidden || false;
      RoomService.getRoomById(parseInt($stateParams.room)).then(function(room){
        if(room && $stateParams.user){
          RoomService.setConfig({ room: room, publishingFromStart: !startHidden });
          UserService.signin($stateParams.user);
          deferred.resolve("Room and User set!");
        } else {
          deferred.reject('No User found!');
        }
      }, function(){
        deferred.reject('No Room found!');
      });
      return deferred.promise;
    }

    function enter() {
      UserService.currentUser().then(function (user) {
        RoomService.enter(user.username);
      });
    }

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
})();
