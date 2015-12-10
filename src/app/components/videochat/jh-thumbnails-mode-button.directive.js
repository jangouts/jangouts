/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhThumbnailsModeButton', jhThumbnailsModeButtonDirective);

  jhThumbnailsModeButtonDirective.$inject = ['jhConfig', '$timeout'];

  function jhThumbnailsModeButtonDirective(jhConfig, $timeout) {
    return {
      restrict: 'EA',
      templateUrl: function(elem, attrs) {
        return attrs.textTemplate ? 'app/components/videochat/jh-thumbnails-mode-button-with-text.html' : 'app/components/videochat/jh-thumbnails-mode-button.html'
      },
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: jhThumbnailsModeButtonCtrl
    };

    function jhThumbnailsModeButtonCtrl() {
      /* jshint: validthis */
      var vm = this;

      vm.click = click;
      vm.isChecked = isChecked;

      function click() {
        $timeout(function() {
          jhConfig.videoThumbnails = !jhConfig.videoThumbnails;
        });
      }

      function isChecked() {
        return jhConfig.videoThumbnails;
      }
    }
  }

})();
