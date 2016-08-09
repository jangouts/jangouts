/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

BrowserInfoCtrl.$inject = ["$uibModalInstance", "jhConfig"];

function BrowserInfoCtrl($uibModalInstance, jhConfig) {
  var vm = this;
  vm.usingSSL = function() { return jhConfig.usingSSL; };
  vm.httpsUrl = function() { return jhConfig.httpsUrl(); };
  vm.close = close;

  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}

export default BrowserInfoCtrl;
