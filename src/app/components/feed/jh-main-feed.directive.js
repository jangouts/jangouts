/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhMainFeed', jhMainFeedDirective);
  
    jhMainFeedDirective.$inject = ['$timeout'];
    
  function jhMainFeedDirective($timeout) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/jh-main-feed.html',
      scope: {
        feed: '=',
        message: '@'
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhMainFeedCtrl,
      link: jhMainFeedLink,
    };

    function jhMainFeedLink(scope, element) {
      scope.$watch('vm.feed.getStream()', function(newVal) {
        if (newVal !== undefined && newVal !== null) {
          var video = $('video', element)[0];
          video.muted = true;
          Janus.attachMediaStream(video, newVal);
        }
      });
      
      $timeout(function(){
        var mainFeed = document.getElementById('main-feed');
        mainFeed.addEventListener('dblclick', function() {
          // if video is in fullscreen mode
          if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          ) {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
            // if video is not in fullscreen mode
          } else {
            if (mainFeed.requestFullscreen) {
              mainFeed.requestFullscreen();
            } else if (mainFeed.webkitRequestFullscreen) {
              mainFeed.webkitRequestFullscreen();
            } else if (mainFeed.mozRequestFullScreen) {
              mainFeed.mozRequestFullScreen();
            } else if (mainFeed.msRequestFullscreen) {
              mainFeed.msRequestFullscreen();
            }
          } 
        });
        
      });
    }

    function JhMainFeedCtrl() {} 
  }
})();
