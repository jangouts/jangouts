(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhVideoChat', ['FeedsService', 'RoomService', jhVideoChatDirective]);

  function jhVideoChatDirective(FeedsService, RoomService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-video-chat.html',
      scope: {
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: jhVideoChatCtrl
    }

    function jhVideoChatCtrl() {
      /* jshint: validthis */
      var vm = this;

      /* Data */
      vm.highlight = {
        current: null,
        byUser: null
      };

      /* Functions */
      vm.feeds = feeds;
      vm.highlightedFeed = highlightedFeed;
      vm.toggleHighlightedFeed = toggleHighlightedFeed;

      function feeds() {
        return FeedsService.allFeeds();
      }

      function highlightedFeed() {
        if (vm.highlight.byUser !== null) {
          vm.highlight.current = vm.highlight.byUser;
        } else {
          vm.highlight.current = FeedsService.speakingFeed() || vm.highlight.current || FeedsService.findMain();
        }
        return vm.highlight.current;
      }

      function toggleHighlightedFeed(feed) {
        return vm.highlight.byUser = vm.highlight.byUser ? null : feed;
      }
    }
  }

})();
