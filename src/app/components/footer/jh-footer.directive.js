(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFooter', ['jhConfig', jhFooterDirective]);

  function jhFooterDirective(jhConfig) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/footer/jh-footer.html',
      scope: true,
      controller: JhFooterCtrl,
      controllerAs: 'vm'
    };

    function JhFooterCtrl() {
      this.version = jhConfig.version;
    }
  }
})();
