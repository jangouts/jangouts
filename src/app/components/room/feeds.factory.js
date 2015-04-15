(function () {
  angular.module('janusHangouts')
    .factory('Feed', feedFactory);

  function feedFactory() {
    return function() {
      this.id = 0;
      this.display = null;
      this.pluginHandle = null;
      this.stream = null;
    };
  }
})();
