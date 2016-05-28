/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

function jhMainFeedDirective() {
  return {
    restrict: 'EA',
    template: require('./jh-main-feed.html'),
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
        var video = <HTMLVideoElement>$('video', element)[0];
        video.muted = true;
        attachMediaStream(video, newVal);
      }
    });
  }

  function JhMainFeedCtrl() {}
}

export default jhMainFeedDirective;
