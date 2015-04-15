(function () {
  angular.module('janusHangouts')
    .factory('Feed', feedFactory);

  function feedFactory() {
    return function(attrs) {
      attrs = attrs || {};

      this.id = attrs.id || 0;
      this.display = attrs.display || null;
      this.pluginHandle = attrs.pluginHandle || null;
      this.stream = attrs.stream || null;
    };
  }
})();
