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

  MuteNotifier.$inject = ['$animate', 'notifications', 'ngAudio', 'ActionService'];

  function MuteNotifier($animate, notifications, ngAudio, ActionService) {
    this.speaking = speaking;
    this.muted = muted;
    this.joinedMuted = joinedMuted;
    this.dismissLastNotification = dismissLastNotification;
    var bell = ngAudio.load("assets/sounds/bell.ogg");
    var noShow = {};
    var lastNotification = null;

    function muted() {
      info("You have been muted by another user.");
    }

    function speaking() {
      info("Trying to say something? You are muted.");
    }

    function joinedMuted(){
      info("You're muted. Unmute yourself to join the conversation!");
    }

    function dismissLastNotification(){
      if(lastNotification !== null) {
        lastNotification.close();
      }
    }

    function info(text) {
      if (text in noShow)
      {
        return;
      }
      var notif = notifications.info("Muted", text, {
        show: function() { bell.play(); },
        close: function() { lastNotification = null; },
        duration: 20000,
        attachTo: $('#videochat-body'),
        actions: [{
          label: 'Unmute',
          className: 'btn btn-default',
          fn: function() { ActionService.toggleChannel("audio"); notif.close(); }
        },
        {
          label: 'Do not show again',
          className: 'btn btn-default',
          fn: function() { noShow[text] = true; notif.close(); }
        }]
      });
      lastNotification = notif;
    }
  }
}());
