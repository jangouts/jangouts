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

  jhThumbnailsModeButtonDirective.$inject = ['jhConfig', '$timeout', 'FeedsService'];

  function jhThumbnailsModeButtonDirective(jhConfig, $timeout, FeedsService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-thumbnails-mode-button.html',
      controllerAs: 'vm',
      bindToController: true,
      controller: jhThumbnailsModeButtonCtrl
    };

    function jhThumbnailsModeButtonCtrl() {
      /* jshint: validthis */
      var vm = this;

      vm.click = click;
      vm.cssClass = cssClass;
      vm.title = title;

      function click() {
        $timeout(function() {
          jhConfig.videoThumbnails = !jhConfig.videoThumbnails;
          // If we are not going to display the remote videos, simply stop
          // receiving them (and the other way around)
          _.forEach(FeedsService.allFeeds(), function(feed) {
            if (!feed.isPublisher) {
              feed.configure({video: jhConfig.videoThumbnails});
            }
          });
        });
      }

      function cssClass() {
        if (jhConfig.videoThumbnails) {
          return "btn-default";
        } else {
          return "btn-danger";
        }
      }

      function title() {
        if (jhConfig.videoThumbnails) {
          return "Disable video for peer's thumbnails";
        } else {
          return "Enable video for peer's thumbnails";
        }
      }
    }
  }

})();
