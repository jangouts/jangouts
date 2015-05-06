/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('Room', roomFactory);

  function roomFactory() {
    return function(attrs) {
      attrs = attrs || {};

      _.assign(this, attrs);
      this.id = this.room;
      this.label = this.description + " (" + this.num_participants + "/" + this.max_publishers + " users)";
    };
  }
})();
