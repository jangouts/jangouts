/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhThumbVideosButton', jhThumbVideosButtonDirective);

  function jhThumbVideosButtonDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-thumb-videos-button.html',
      scope: {
        clickFn: '&',
        thumbVideos: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: jhThumbVideosButtonCtrl
    };

    function jhThumbVideosButtonCtrl() {
      /* jshint: validthis */
      var vm = this;

      vm.click = click;
      vm.cssClass = cssClass;
      vm.title = title;

      function click() {
        vm.clickFn();
      }

      function cssClass() {
        if (vm.thumbVideos) {
          return "btn-default";
        } else {
          return "btn-danger";
        }
      }

      function title() {
        if (vm.thumbVideos) {
          return "Disable video for peer's thumbnails";
        } else {
          return "Enable video for peer's thumbnails";
        }
      }
    }
  }

})();
