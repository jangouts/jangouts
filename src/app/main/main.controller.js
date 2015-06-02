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

  MainCtrl.$inject = ['$scope', 'blockUI', 'UserService', 'RoomService',
    'LogService', 'hotkeys'];

  function MainCtrl($scope, blockUI, UserService, RoomService, LogService, hotkeys) {
    $scope.data = {
      logEntries: function() {
        return LogService.allEntries();
      },
      highlightedByUser: null,
      highlighted: null,
      isConsentDialogOpen: null
    };
    $scope.enter = enter;

    $scope.enter();

    $scope.$on('room.error', function(evt, error) {
      // FIXME: do something neat
      alert("Janus error: " + error);
    });

    $scope.$on('user.unset', function(evt) {
      RoomService.leave();
    });

    $scope.$on('consentDialog.changed', function(evt, open) {
      if (open) {
        blockUI.start();
      } else if (!open) {
        blockUI.stop();
      }
    });

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
        callback: function() { UserService.signout();; }
      });
    $scope.hotkeys = hotkeys;

    //call the screen risize function
    adjust_screen_height ()
  }
})();

//Please, relocate this script if it does not belong here.
//Lets take the screen size and adjust the size of the video
var windowHeight;
var windowWidth;
var headerHeight;
var footerHeight;
var finalHeight;

//if the user risizes the screen, adjust it again
$(window).on('resize', function() {
  adjust_screen_height ();
})

function adjust_screen_height () {
  windowHeight = $(window).outerHeight();
  headerHeight = $("header").outerHeight();
  footerHeight = $("footer").outerHeight();

  finalHeight = windowHeight - headerHeight - footerHeight;

  $("#videochat-playroom").css({
    height: finalHeight + 'px'
  })
  $("#chat-playroom").css({
    height: finalHeight + 'px'
  })
}


