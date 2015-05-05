(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFooter', jhFooterDirective);

  jhFooterDirective.$inject = ['jhConfig'];

  function jhFooterDirective(jhConfig) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/footer/jh-footer.html',
      scope: true,
      controller: JhFooterCtrl,
      controllerAs: 'vm'
    };

    function JhFooterCtrl() {
      /* jshint validthis:true */
      this.version = jhConfig.version;
    }
  }
})();
