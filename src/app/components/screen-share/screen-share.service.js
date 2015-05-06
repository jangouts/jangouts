/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('ScreenShareService', ScreenShareService);

  ScreenShareService.$inject = ['$timeout', '$modal', 'jhConfig'];

  function ScreenShareService($timeout, $modal, jhConfig) {
    this.inProgress = false;
    this.setInProgress = setInProgress;
    this.getInProgress = getInProgress;
    this.showHelp = showHelp;
    this.usingSSL = usingSSL;
    this.httpsUrl = httpsUrl;

    function setInProgress(value) {
      var that = this;
      $timeout(function () {
        that.inProgress = value;
      });
    }

    function getInProgress() {
      return this.inProgress;
    }

    function usingSSL() {
      return (window.location.protocol === 'https:');
    }

    function httpsUrl() {
      if (jhConfig.httpsAvailable) {
        if (jhConfig.httpsUrl) {
          return jhConfig.httpsUrl;
        } else {
          return "https://" + window.location.hostname + window.location.pathname;
        }
      } else {
        return null;
      }
    }

    function showHelp() {
      $modal.open({
        animation: true,
        templateUrl: 'app/components/screen-share/screen-share-help.html',
        controller: 'ScreenShareHelpCtrl',
        controllerAs: 'vm'
      });
    }
  }
}());
