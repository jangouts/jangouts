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
      templateUrl: 'app/components/videochat/jh-feed.html',
      scope: {
        feed: '=',
        clickFn: '&',
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

      scope.vm.initPics(element);
      $interval(scope.vm.takePic, 5000);
    }

    function JhFeedCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.mirrored = (vm.feed.isPublisher && !vm.feed.isLocalScreen);
      vm.toggleAudio = toggleAudio;
      vm.toggleVideo = toggleVideo;
      vm.thumbnailTag = thumbnailTag;
      vm.showsEnableAudio = showsEnableAudio;
      vm.showsDisableAudio = showsDisableAudio;
      vm.showsAudioOff = showsAudioOff;
      vm.showsEnableVideo =showsEnableVideo;
      vm.showsDisableVideo = showsDisableVideo;
      vm.unPublish = unPublish;
      vm.showsUnPublish = showsUnPublish;
      vm.ignore = ignore;
      vm.stopIgnoring = stopIgnoring;
      vm.showsIgnore = showsIgnore;
      vm.showsStopIgnoring = showsStopIgnoring;
      vm.initPics = initPics;
      vm.takePic = takePic;

      function toggleAudio() {
        RoomService.toggleChannel("audio", vm.feed);
      }

      function toggleVideo() {
        RoomService.toggleChannel("video", vm.feed);
      }

      function unPublish() {
        RoomService.unPublishFeed(vm.feed.id);
      }

      function showsUnPublish() {
        return (vm.feed.isPublisher && vm.feed.isLocalScreen);
      }

      function thumbnailTag() {
        if (vm.highlighted || vm.feed.isIgnored) { return "placeholder"; }
        if (!vm.feed.videoEnabled) { return "placeholder"; }
        if (vm.feed.isPublisher) { return "video"; }

        if (jhConfig.videoThumbnails || vm.feed.speaking) {
          return "video";
        } else {
          return "picture";
        }
      }

      function showsEnableAudio() {
        return (vm.feed.isPublisher && !vm.feed.audioEnabled);
      }

      function showsDisableAudio() {
        return (!vm.feed.isIgnored && vm.feed.audioEnabled);
      }

      function showsAudioOff() {
        return (!vm.feed.isPublisher && !vm.feed.isIgnored && !vm.feed.audioEnabled);
      }

      function showsEnableVideo() {
        return (vm.feed.isPublisher && !vm.feed.videoEnabled);
      }

      function showsDisableVideo() {
        return (vm.feed.isPublisher && vm.feed.videoEnabled);
      }

      function ignore() {
        RoomService.ignoreFeed(vm.feed.id);
      }

      function showsIgnore() {
        return (!vm.feed.isPublisher && !vm.feed.isIgnored);
      }

      function stopIgnoring() {
        RoomService.stopIgnoringFeed(vm.feed.id);
      }

      function showsStopIgnoring() {
        return vm.feed.isIgnored;
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
        if (jhConfig.videoThumbnails) { return; }

        var width = vm.picCanvas[0].width;
        // Skip the rest if the video has no dimensions yet
        if (vm.picSource[0].videoHeight) {
          var height = width * vm.picSource[0].videoHeight / vm.picSource[0].videoWidth;
          vm.picCanvas[0].height = height;
          vm.picContext.drawImage(vm.picSource[0], 0, 0, width, height);
          // Prepare for next step: sending the picture
          //vm.feed.updatePic(picCanvas.toDataURL('image/jpeg',0.4));
        }
      }
    }
  }
})();
