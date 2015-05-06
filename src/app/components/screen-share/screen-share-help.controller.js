/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('ScreenShareHelpCtrl', ScreenShareHelpCtrl);

  function ScreenShareHelpCtrl($modalInstance) {
    var vm = this;
    vm.close = close;
    vm.hostname = hostname;

    function close() {
      $modalInstance.dismiss('cancel');
    }

    function hostname() {
      return window.location.hostname;
    }
  }
})();
