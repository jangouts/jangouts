/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('MuteNotifier',  MuteNotifier);

  MuteNotifier.$inject = ['$animate', 'notifications', 'ngAudio', 'ActionService', "jhConfig"];

  function MuteNotifier($animate, notifications, ngAudio, ActionService, jhConfig) {
    this.speaking = speaking;
    this.muted = muted;
    this.joinedMuted = joinedMuted;
    this.dismissLastNotification = dismissLastNotification;
    var bell = ngAudio.load("assets/sounds/bell.ogg");
    var noShow = {};
    var lastNotification = null;
    var notifying = false;

    function muted() {
      info("You have been muted by another user.");
    }

    function speaking() {
      info("Trying to say something? You are muted.");
    }

    function joinedMuted(){
      var notiftext = "You are muted because ";
      if(jhConfig.joinUnmutedLimit === 0){
        notiftext += "everyone who enters a room is muted by default.";
      }
      else if(jhConfig.joinUnmutedLimit === 1){
        notiftext +=  "there is already one participant in the room.";
      }
      else{
        notiftext += "there are already " + jhConfig.joinUnmutedLimit + " participants in the room.";
      }

      info(notiftext);

    }

    function dismissLastNotification(){
      if(lastNotification !== null) {
        lastNotification.close();
      }
    }

    function info(text) {
      if (text in noShow || notifying)
      {
        return;
      }
      var notif = notifications.info("Muted", text, {
        show: function() { notifying = true; bell.play(); },
        close: function() {notifying = false; lastNotification = null; },
        duration: 20000,
        attachTo: $('#videochat-body'),
        actions: [{
          label: 'Unmute',
          className: 'btn btn-default',
          fn: function() { ActionService.toggleChannel("audio"); notif.close(); }
        },
        {
          label: "Don't show again",
          className: 'btn btn-default',
          fn: function() { noShow[text] = true; notif.close(); }
        }]
      });
      lastNotification = notif;
    }
  }
}());
