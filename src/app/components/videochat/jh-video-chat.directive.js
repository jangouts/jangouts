(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhVideoChat', jhVideoChatDirective);

  jhVideoChatDirective.$inject = ['FeedsService'];

  function jhVideoChatDirective(FeedsService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-video-chat.html',
      scope: {
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: jhVideoChatCtrl
    };

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
      vm.mirrored = mirrored;
      vm.toggleHighlightedFeed = toggleHighlightedFeed;
      vm.isHighlightedByUser = isHighlightedByUser;

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

      function mirrored() {
        var f = vm.highlightedFeed();
        if (f) {
          return (f.isPublisher && !f.isLocalScreen);
        } else {
          return false;
        }
      }

      function toggleHighlightedFeed(feed) {
        if (vm.highlight.byUser !== feed) {
          vm.highlight.byUser = feed;
        } else {
          vm.highlight.byUser = null;
        }
      }

      function isHighlightedByUser(f) {
        return f === vm.highlight.byUser;
      }
    }
  }

})();
