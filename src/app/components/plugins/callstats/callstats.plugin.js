/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('CallstatsPlugin', CallstatsPlugin);

  CallstatsPlugin.$inject = ['$document', '$q', '$timeout', 'EventsService', 'CallstatsProvider'];

  /*
   * Service connecting CallstatsProvider with PluginsService
   */
  function CallstatsPlugin($document, $q, $timeout, EventsService, CallstatsProvider) {
    this.init = function() {
      loadCallstats().then(function() {
        loadPluginConfig();

        // setting callstats object
        CallstatsProvider.callstats = new window.callstats();
        if (CallstatsProvider.callstats === null ||
          CallstatsProvider.callstats === undefined) {
          console.error("Something went wrong loading callstats.min.js!");
        }

        // enabling callstatsModule to receive events by subscribing to the events Subject
        CallstatsProvider.subscribeToEventsSubject(EventsService.getEventsSubject());

      }).catch(function() {
        console.error("Could not load callstats.min.js!");
      });
    };

    function loadCallstats() {
      var document = $document[0];
      var deferred = $q.defer();
      var script = document.createElement('script');

      script.src = 'https://api.callstats.io/static/callstats.min.js';
      document.body.appendChild(script);

      script.onload = script.onreadystatechange = function(e) {
        if (script.readyState && !['complete', 'loaded'].includes(script.readyState)) {
          return;
        }

        $timeout(function() {
          deferred.resolve(e);
        });
      };
      script.onerror = function(e) {
        $timeout(function() {
          deferred.reject(e);
        });
      };

      return deferred.promise;
    }

    /*
     * Reads config.callstats.json
     */
    function loadPluginConfig() {
      // FIXME: quite some code duplication with the code reading the general
      // Jangouts configuration. It should be extracted to some common function
      // provided by jhConfig.
      var request = new XMLHttpRequest();
      request.open('GET', 'config.callstats.json', false);
      request.send(null);
      if (request.status === 200) {
        var config = JSON.parse(request.responseText);
        angular.forEach(config, function (value, key) {
          //assigning config value with replaced value of placeholder
          CallstatsProvider[key] = value;
        });
      } else {
        console.warn('No Callstats configuration found!');
      }
    }
  }
})();
