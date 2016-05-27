/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

BrowserInfoCtrl.$inject = ["$uibModalInstance", "RequestService"];

function BrowserInfoCtrl($uibModalInstance, RequestService) {
  var vm = this;
  vm.usingSSL = function() { return RequestService.usingSSL(); };
  vm.httpsUrl = function() { return RequestService.httpsUrl(); };
  vm.close = close;

  function close() {
    $uibModalInstance.dismiss('cancel');
  }
}

export default BrowserInfoCtrl;
