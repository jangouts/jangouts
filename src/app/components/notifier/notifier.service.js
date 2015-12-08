/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('Notifier',  Notifier);

  Notifier.$inject = ['$animate', 'toastr', 'ngAudio'];

  function Notifier($animate, toastr, ngAudio) {
    this.info = info;
    var bell = ngAudio.load("assets/sounds/bell.mp3");

    function info(text) {
      bell.play();
      text = text +
        '<div>' +
          '<button id="unmute" ng-click="alert(\'unmute\')">Unmute</button>' +
          '<button type="button" ng-click="alert(\'unmute\')")>Do not show again</button>' +
        '</div>';
      toastr.info(text, {
        onShown: function() { bell.play(); },
        timeOut: 0, /*6000,*/
        extendedTimeOut: 0,
        allowHtml: true
      });
    }
  }
}());
