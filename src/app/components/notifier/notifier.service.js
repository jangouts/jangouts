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
    var bell = ngAudio.load("assets/sounds/bell.ogg");

    function info(text) {
      bell.play();
      toastr.info(text, {
        onShown: function() { bell.play(); },
        timeOut: 3000
      });
    }
  }
}());
