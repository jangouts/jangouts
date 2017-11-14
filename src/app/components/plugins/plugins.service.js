/*
 * Copyright (C) 2017 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('PluginsService', PluginsService);

  // FIXME: in this first version of the PluginsService, the plugins are
  // hard-coded as explicit dependencies of the service. A more dynamic
  // mechanism will be added after finishing the ongoing migration of Jangouts
  // to Angular 2+.
  PluginsService.$inject = ['jhConfig', 'CallstatsPlugin'];

  /**
   * Simplistic service allowing to define plugins that add extra functionality
   * on top of Jangouts core.
   *
   * @constructor
   * @memberof module:janusHangouts
   */
  function PluginsService(jhConfig, CallstatsPlugin) {
    /*
     * Calls the init function of all the enabled plugins.
     */
    this.initPlugins = function() {
      // FIXME: hard-coded, see comment above
      if (jhConfig.enabledPlugins && jhConfig.enabledPlugins.includes("callstats")) {
        console.info("Initializing CallstatsPlugin");
        CallstatsPlugin.init();
      }
    };
  }
})();
