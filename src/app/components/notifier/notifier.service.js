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

  MuteNotifier.$inject = ['$animate', 'notifications', 'ngAudio',
    'ActionService'];

  function MuteNotifier($animate, notifications, ngAudio, ActionService) {
    this.info = info;
    var bell = ngAudio.load("assets/sounds/bell.ogg");
    var noShow = {};

    function info(text) {
      if (text in noShow)
      {
        return;
      }
      var notif = notifications.info("Muted", text, {
        shown: function() { bell.play(); },
        duration: 20000,
        attachTo: $('#body'),
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
    }
  }
}());
