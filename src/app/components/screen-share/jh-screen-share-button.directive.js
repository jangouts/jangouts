/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhScreenShareButton', jhScreenShareButtonDirective);

  function jhScreenShareButtonDirective() {
    // Firefox needs different WebRTC constraints for screen and window sharing
    var suffix = (window.navigator.mozGetUserMedia) ? '-moz' : '';

    return {
      restrict: 'EA',
      templateUrl: 'app/components/screen-share/jh-screen-share-button' + suffix + '.html',
      scope: true,
      controllerAs: 'vm',
      bindToController: true,
      controller: JhScreenShareButtonCtrl
    };

    function JhScreenShareButtonCtrl() {}
  }
})();
