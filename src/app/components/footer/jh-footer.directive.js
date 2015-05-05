(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFooter', jhFooterDirective);

  function jhFooterDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/footer/jh-footer.html',
      scope: true,
    };
  }
})();
