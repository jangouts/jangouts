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
      thumbVideos: true
    };
    $scope.enter = enter;
    $scope.toggleThumbVideos = toggleThumbVideos;

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

    function toggleThumbVideos() {
      console.log("cambia");
      $scope.data.thumbVideos = !$scope.data.thumbVideos;
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

    //call the screen risize function
    adjustScreenHeight ();
  }
})();

//Please, relocate this script if it does not belong here.
//Lets take the screen size and adjust the size of the video
//if the user risizes the screen, adjust it again
$(window).on('resize', function() {
  'use strict';
  adjustScreenHeight ();
});

function adjustScreenHeight () {
  'use strict';

  var windowHeight;
  var headerHeight;
  var footerHeight;
  var finalHeight;
  var shareBtnHeight;
  var footerChatHeight;
  var finalHeightChat;

  windowHeight = $(window).outerHeight();
  headerHeight = $("header").outerHeight();
  footerHeight = $("footer").outerHeight();
  shareBtnHeight = $(".share-help-btn").outerHeight();

  finalHeight = windowHeight - headerHeight - footerHeight;

  $("#videochat-playroom").css({
    height: finalHeight + 'px'
  });

  $("#chat-playroom").css({
    height: finalHeight + 'px'
  });

  //for the chat room the number needs to rest the share button div. 30 for the paddings.

  footerChatHeight = $("#chat-form-footer").outerHeight();

  finalHeightChat = finalHeight - shareBtnHeight - footerChatHeight - 35;

  $("#jh-chat-messages").css({
    height: finalHeightChat + 'px'
  });
}
