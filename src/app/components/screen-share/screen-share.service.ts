/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

ScreenShareService.$inject = ['$timeout', '$uibModal'];

function ScreenShareService($timeout, $uibModal) {
  this.inProgress = false;
  this.setInProgress = setInProgress;
  this.getInProgress = getInProgress;
  this.showHelp = showHelp;

  function setInProgress(value) {
    var that = this;
    $timeout(function () {
      that.inProgress = value;
    });
  }

  function getInProgress() {
    return this.inProgress;
  }

  function showHelp() {
    $uibModal.open({
      animation: true,
      templateUrl: 'app/components/screen-share/screen-share-help.html',
      controller: 'ScreenShareHelpCtrl',
      controllerAs: 'vm'
    });
  }
}

export default ScreenShareService;
