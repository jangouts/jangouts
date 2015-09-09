/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFeed', jhFeed);

  jhFeed.$inject = ['RoomService', '$interval', 'jhConfig'];

  function jhFeed(RoomService, $interval, jhConfig) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/jh-feed.html',
      scope: {
        feed: '=',
        toggleHighlightFn: '&',
        highlighted: '=',
        highlightedByUser: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhFeedCtrl,
      link: jhFeedLink,
    };

    function jhFeedLink(scope, element) {
      scope.$watch('vm.feed.stream', function(newVal) {
        if (newVal !== undefined) {
          var video = $('video', element)[0];
          // Mute video of the local stream
          video.muted = scope.vm.feed.isPublisher;
          attachMediaStream(video, newVal);
        }
      });

      var vm = scope.vm;
      var feed = vm.feed;
      // If it's a publisher feed, we have to constantly send video and photos
      // Otherwise, we have to manage the video subscription
      if (feed.isPublisher) {
        vm.initPics(element);
        vm.takePic();
        $interval(vm.takePic, 20000);
      } else {
        feed.setVideoSubscription(jhConfig.videoThumbnails || vm.highlighted);
        scope.$watch(
          function() { return jhConfig.videoThumbnails || vm.highlighted || !vm.feed.isSilent(); },
          function(video) { feed.setVideoSubscription(video); }
        );
      }
    }

    function JhFeedCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.mirrored = (vm.feed.isPublisher && !vm.feed.isLocalScreen);
      vm.thumbnailTag = thumbnailTag;
      vm.initPics = initPics;
      vm.takePic = takePic;

      function thumbnailTag() {
        if (vm.highlighted || vm.feed.isIgnored) { return "placeholder"; }
        if (!vm.feed.getVideoEnabled()) { return "placeholder"; }
        if (vm.feed.isPublisher) { return "video"; }

        if (vm.feed.getVideoSubscription()) {
          return "video";
        } else {
          if (vm.feed.getPicture()) {
            return "picture";
          } else {
            return "placeholder";
          }
        }
      }

      function initPics(element) {
        var canvas = $('canvas', element);
        var canvasTag = canvas[0];
        var video = $('video', element).first();
        var context = canvasTag.getContext('2d');

        // Initially set it to 4:3 (fitting the placeholder image)
        canvasTag.width = canvas.width();
        canvasTag.height = Math.round(canvasTag.width * 0.75);

        var placeholder = new Image();
        placeholder.src = "assets/images/placeholder.png";
        placeholder.onload = function() {
          context.drawImage(placeholder, 0, 0, canvasTag.width, canvasTag.height);
        };

        vm.picCanvas = canvas;
        vm.picSource = video;
        vm.picContext = context;
      }

      function takePic() {
        var canvas = vm.picCanvas[0];
        var width = canvas.width;
        // Skip the rest if the video has no dimensions yet
        if (vm.picSource[0].videoHeight) {
          var height = width * vm.picSource[0].videoHeight / vm.picSource[0].videoWidth;
          canvas.height = height;
          vm.picContext.drawImage(vm.picSource[0], 0, 0, width, height);
          vm.feed.updateLocalPic(canvas.toDataURL('image/jpeg',0.4));
        }
      }
    }
  }
})();
