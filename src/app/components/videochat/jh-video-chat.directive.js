/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhVideoChat', jhVideoChatDirective);

  jhVideoChatDirective.$inject = ['$window', 'LogService', 'FeedsService'];

  function jhVideoChatDirective($window, LogService, FeedsService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-video-chat.html',
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      link: jhVideoChatLink,
      controller: jhVideoChatCtrl
    };

    function jhVideoChatLink(scope) {
      angular.element($window).on('resize', function() {
        scope.vm.adjustScreenHeight();
      });

      /* Maybe it's not responsability for this directive */
      scope.$watch('vm.logEntries().length', function(newVal, oldVal) {
        if (!scope.vm.isChatActive) {
          scope.vm.pendingEntries += (newVal - oldVal);
        }
      });

      scope.$watch('vm.isChatActive', function(newVal) {
        if (newVal === true) {
          scope.vm.pendingEntries = 0;
        }
      });
      //resize the screen to adjust the video and chat
      adjustScreenHeight()
    }

    function jhVideoChatCtrl() {
      /* jshint: validthis */
      var vm = this;

      /* Data */
      vm.highlight = {
        // Feed explicitly selected as highlight by the user (using the UI)
        byUser: null,
        // Feed currently highlighted, either manually (if byUser is set) or
        // automatically (if byUser is null)
        current: null
      };
      vm.isChatActive = false;
      vm.pendingEntries = 0;

      /* Functions */
      vm.feeds = feeds;
      vm.highlightedFeed = highlightedFeed;
      vm.mirrored = mirrored;
      vm.toggleHighlightedFeed = toggleHighlightedFeed;
      vm.isHighlighted = isHighlighted;
      vm.isHighlightedByUser = isHighlightedByUser;
      vm.logEntries = logEntries;
      vm.adjustScreenHeight = adjustScreenHeight;

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

      function isHighlighted(f) {
        return f === vm.highlight.current;
      }

      function isHighlightedByUser(f) {
        return f === vm.highlight.byUser;
      }

      function logEntries() {
        return LogService.allEntries();
      }

    }
  }


})();

// Lets take the screen size and adjust the size of the video
// if the user resizes the screen, adjust it again
function adjustScreenHeight() {
  var windowHeight;
  var headerHeight;
  var footerHeight;
  var finalHeight;
  var shareBtnHeight;
  var footerChatHeight;
  var finalHeightChat;

  windowHeight = $(window).outerHeight();
  footerHeight = $("footer").outerHeight();
  shareBtnHeight = $(".share-help-btn").outerHeight();

  finalHeight = windowHeight - footerHeight;

  $("#videochat-playroom").css({
    height: finalHeight + 'px'
  });

  $("#signin").css({
    height: finalHeight + 'px'
  });

  $("#chat-playroom").css({
    height: finalHeight + 'px'
  });

  //for the chat room the number needs to rest the share button div. 30 for the paddings.

  footerChatHeight = $("#chat-form-footer").outerHeight();

  finalHeightChat = finalHeight - shareBtnHeight - footerChatHeight - 35;

  $("#jh-chat-messages").css({
    height: finalHeightChat + 'px'
  });
}
