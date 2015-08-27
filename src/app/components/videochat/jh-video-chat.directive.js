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

  jhVideoChatDirective.$inject = ['$window', 'LogService', 'FeedsService', 'hotkeys', '$timeout'];

  function jhVideoChatDirective($window, LogService, FeedsService, hotkeys, $timeout) {
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
      scope.$on('gridster-resized', function() {
        scope.vm.adjustAllSizes();
      });
      // 'gridster-item-initialized' is not working for us,
      // let's workaround the problem
      $timeout(function() { scope.vm.adjustAllSizes(); }, 600);
    }

    function jhVideoChatCtrl() {
      /* jshint: validthis */
      var vm = this;
      var cols = 16;
      // Window width minus the paddings
      var gridWidth = $(window).width() - 25;
      // Window height minus header and footer (and some safety pixels)
      var gridHeight = $(window).height() - 33 - 20 - 5;
      // Items are square, i.e. width == height
      var itemHeight = gridWidth / cols;
      // How many rows do we have room for?
      var rows = Math.floor(gridHeight / itemHeight);
      if (rows < 6) { rows = 6; }

      // Adjust the layout depending on the vertical space
      var feedsH, chatH, chatR, chatC;
      if (rows < 10) {
        // Not enough space under the speaker (which is always 8x6) for the chat
        feedsH = Math.ceil(rows/2);
        chatH = Math.floor(rows/2);
        chatR = feedsH;
        chatC = 8;
      } else {
        // Chat below the speaker
        feedsH = rows;
        chatH = rows - 6;
        chatR = 6;
        chatC = 0;
      }

      vm.gridsterItems = [
        { size: [8, 6], position: [0, 0], content: "Speaker" },
        { size: [8, feedsH], position: [0, 8], content: "Participants" },
        { size: [8, chatH], position: [chatR, chatC], content: "Chat" }
      ];
      vm.gridsterOpts = {
        columns: cols,
        resizable: {
          stop: function(event, $element) {
            // 'gridster-item-transition-end' is not working for us, so we have
            // to use this callback and wait some extra time for the animations
            // to finish
            $timeout(function() { vm.adjustSize($element); }, 600);
          }
        }
      };

      /* Data */
      vm.highlight = {
        // Feed explicitly selected as highlight by the user (using the UI)
        byUser: null,
        // Feed currently highlighted, either manually (if byUser is set) or
        // automatically (if byUser is null)
        current: null
      };

      /* Functions */
      vm.feeds = feeds;
      vm.highlightedFeed = highlightedFeed;
      vm.mirrored = mirrored;
      vm.toggleHighlightedFeed = toggleHighlightedFeed;
      vm.isHighlighted = isHighlighted;
      vm.isHighlightedByUser = isHighlightedByUser;
      vm.logEntries = logEntries;
      vm.adjustSize = adjustSize;
      vm.adjustAllSizes = adjustAllSizes;
      vm.showHotkeys = showHotkeys;

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

      function adjustSize($element) {
        var width = $element.innerWidth();
        var height = $element.innerHeight();
        var inner;

        // Is this the video grid item?
        inner = $("#main-video video", $element);
        if (inner.length) {
          inner.css({height: height + "px", width: width + "px"});
        }

        // Is this the chat grid item?
        inner = $("#jh-chat-messages", $element);
        if (inner.length) {
          inner.css({height: height - 40 + "px"});
        }

        // Is this the list of feeds item?
        inner = $("#thumbnails", $element);
        if (inner.length) {
          inner.css({height: height + "px", width: width + "px"});
        }

      }

      function adjustAllSizes() {
        $(".gridster-item").each(function(index, e) {
          vm.adjustSize($(e));
        });
      }

      function showHotkeys() {
        hotkeys.toggleCheatSheet();
      }
    }
  }
})();
