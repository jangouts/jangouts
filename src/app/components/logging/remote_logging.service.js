/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('RemoteLoggingService', RemoteLoggingService);

  RemoteLoggingService.$inject = ['$http'];

  function RemoteLoggingService($http) {
    this.url = null;
    this.source = null;

    this.setUrl = setUrl;
    this.setSource = setSource;
    this.error = error;
    this.warn = warn;
    this.info = info;
    this.debug = debug;
    this.write = write;

    function setUrl(url) {
      this.url = url;
    }

    function setSource(source) {
      this.source = source;
    }

    function error(message) {
      this.write("error", message);
    }

    function info(message) {
      this.write("info", message);
    }

    function warn(message) {
      this.write("warn", message);
    }

    function debug(message) {
      this.write("debug", message);
    }

    function write(severity, message) {
      if (this.url === null) {
        console[severity](message);
      } else {
        var payload = { severity: severity, content: message };
        if (this.source) {
          payload.source = this.source;
        }
        $http.post(this.url + '/messages', payload);
      }
    }
  }
}());
