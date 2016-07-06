/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

function ScreenShareHelpCtrl($uibModalInstance) {
  var vm = this;
  vm.close = close;
  vm.hostname = hostname;

  function close() {
    $uibModalInstance.dismiss('cancel');
  }

  function hostname() {
    return window.location.hostname;
  }
}

export default ScreenShareHelpCtrl;
