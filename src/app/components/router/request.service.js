/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('RequestService', RequestService);

  RequestService.$inject = ['jhConfig'];

  function RequestService(jhConfig) {
    this.usingSSL = usingSSL;
    this.httpsUrl = httpsUrl;

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
  }
}());
