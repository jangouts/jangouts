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
