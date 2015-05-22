/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('BrowserInfoCtrl', BrowserInfoCtrl);

  function BrowserInfoCtrl($modalInstance) {
    var vm = this;
    vm.close = close;

    function close() {
      $modalInstance.dismiss('cancel');
    }
  }
})();
