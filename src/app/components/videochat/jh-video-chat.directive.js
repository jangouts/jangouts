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

  jhVideoChatDirective.$inject = ['$window', 'LogService', 'FeedsService', 'UserService', 'Notifier', 'hotkeys', '$timeout'];

  function jhVideoChatDirective($window, LogService, FeedsService, UserService, Notifier, hotkeys, $timeout) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/videochat/jh-video-chat.html',
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      link: jhVideoChatLink,
      controller: jhVideoChatCtrl
    };

    function jhVideoChatLink(scope, element) {
      scope.$on('gridster-resized', function() {
        scope.vm.adjustAllSizes();
      });
      // 'gridster-item-initialized' is not working for us,
      // let's workaround the problem
      $timeout(function() { scope.vm.adjustAllSizes(); }, 600);

      scope.$watch(
        function() { return $("#thumbnails .thumb", element).size(); },
        function() { scope.vm.adjustFeedsSizes(); }
      );
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

      var defaultGridsterItems = [
        { size: [8, 6], position: [0, 0], content: "Speaker" },
        { size: [8, feedsH], position: [0, 8], content: "Participants" },
        { size: [8, chatH], position: [chatR, chatC], content: "Chat" }
      ];

      vm.gridsterItems = UserService.getSetting('gridsterItems') || defaultGridsterItems;

      vm.gridsterOpts = {
        columns: cols,
        resizable: {
          enabled: false,
          stop: function (event, $element) {
            // 'gridster-item-transition-end' is not working for us, so we have
            // to use this callback and wait some extra time for the animations
            // to finish
            $timeout(function () {
              vm.adjustSize($element);
            }, 600);
          }
        },
        draggable: {
          enabled: false,
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
      vm.adjustFeedsSizes = adjustFeedsSizes;
      vm.showHotkeys = showHotkeys;
      vm.windowResizeModeOn = false;
      vm.toggleWindowResizeMode = toggleWindowResizeMode;
      vm.setDefaultLayout = setDefaultLayout;

      function feeds() {
        return FeedsService.allFeeds();
      }

      function highlightedFeed() {
        if (vm.highlight.byUser !== null) {
          vm.highlight.current = vm.highlight.byUser;
        } else {
          var current = vm.highlight.current;
          // The current one disconnected
          if (current && !current.isConnected()) {
            current = null;
          }
          // If current one is still speaking, there is no need to change
          if ( !(current && current.getSpeaking() && current.getVideoEnabled()) ) {
            var speaking = FeedsService.speakingFeed();
            if (speaking && speaking.getVideoEnabled()){
              vm.highlight.current = speaking;
            } else {
              vm.highlight.current = current || FeedsService.findMain();
            }
          }
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
          adjustFeedsSizes();
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

      function toggleWindowResizeMode() {
        var vm = this;
        vm.windowResizeModeOn = !vm.windowResizeModeOn;
        vm.gridsterOpts.resizable.enabled = vm.windowResizeModeOn;
        vm.gridsterOpts.draggable.enabled = vm.windowResizeModeOn;

        if(!vm.windowResizeModeOn){
          UserService.setSetting('gridsterItems', vm.gridsterItems);
          Notifier.info('Your layout has been successfully saved!');
        }
      }

      function setDefaultLayout() {
        vm.gridsterItems = defaultGridsterItems;
        UserService.setSetting('gridsterItems', defaultGridsterItems);
      }

      function adjustFeedsSizes() {
        var div = $('#thumbnails');
        var totalWidth = div.innerWidth();
        var totalHeight = div.innerHeight();
        var extraWidth = 4; // borders, margins, etc.
        var extraHeight = 33; // name, margins, etc.
        var qty = $(".thumb", div).size();
        var feedWidth, perRow, rowHeight, numRows;
        // Due to some unexpected behavior in Mozilla, it's better to calculate
        // whether we need the scrollbar than trusting "overflow: auto"
        // See https://github.com/jangouts/jangouts/issues/77
        var scrollbar = true;

        // Do the calculations by trial and error
        for (feedWidth = 128; feedWidth >= 64; feedWidth -= 4) {
          rowHeight = feedWidth * 0.75 + extraHeight;
          perRow = Math.floor(totalWidth / (feedWidth + extraWidth));
          numRows = Math.ceil(qty / perRow);
          // It fits already, we don't need to keep trying
          if (numRows * rowHeight <= totalHeight) {
            scrollbar = false;
            break;
          }
        }
        if (feedWidth < 64) { feedWidth = 64; }

        // Adjust the DOM elements
        $(".face", div).css({height: feedWidth * 0.75 + "px", width: feedWidth + "px"});
        if (scrollbar) {
          div.css({"overflow-y": 'scroll'});
        } else {
          div.css({"overflow-y": 'hidden'});
        }
      }
    }
  }
})();
