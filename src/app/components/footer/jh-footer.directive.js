/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

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
