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

      // Gridster's event system is utterly faulty, it's safer to watch the data
      scope.$watch("vm.gridsterItems", function() {
        if (scope.vm.gridsterIgnoreNextChange) {
          scope.vm.gridsterIgnoreNextChange = false;
        } else {
          scope.vm.gridsterDirtyBit = true;
        }
        // Wait 600ms for the animations to complete
        $timeout(function() { scope.vm.adjustAllSizes(); }, 600);
      }, true);

      scope.$watch(
        function() { return $("#thumbnails .thumb", element).size(); }
      );
    }

    function jhVideoChatCtrl() {
      /* jshint: validthis */
      var vm = this;
      var GRIDSTER_COLS = 16;
      vm.gridsterDirtyBit = false;
      vm.gridsterIgnoreNextChange = true;
      vm.gridsterItems = UserService.getSetting('gridsterItems') || defaultGridsterItems();

      vm.gridsterOpts = {
        columns: GRIDSTER_COLS,
        resizable: { enabled: false },
        draggable: { enabled: false }
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
      vm.mainFeed = mainFeed;
      vm.highlightedFeed = highlightedFeed;
      vm.mirrored = mirrored;
      vm.toggleHighlightedFeed = toggleHighlightedFeed;
      vm.isHighlighted = isHighlighted;
      vm.isHighlightedByUser = isHighlightedByUser;
      vm.logEntries = logEntries;
      vm.adjustAllSizes = adjustAllSizes;
      vm.showHotkeys = showHotkeys;
      vm.windowResizeModeOn = false;
      vm.toggleWindowResizeMode = toggleWindowResizeMode;
      vm.setDefaultLayout = setDefaultLayout;

      function defaultGridsterItems() {
        // Window width minus the paddings
        var gridWidth = $(window).width() - 25;
        // Window height minus header and footer (and some safety pixels)
        var gridHeight = $(window).height() - 33 - 20 - 5;
        // Items are square, i.e. width == height
        var itemHeight = gridWidth / GRIDSTER_COLS;
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

        return [
          { size: [8, 6], position: [0, 0], content: "Speaker" },
          { size: [8, feedsH], position: [0, 8], content: "Participants" },
          { size: [8, chatH], position: [chatR, chatC], content: "Chat" }
        ];
      }

      function storeGridster() {
        if (vm.gridsterDirtyBit) {
          UserService.setSetting('gridsterItems', vm.gridsterItems);
          Notifier.info('Your layout has been successfully saved');
        }
        vm.gridsterDirtyBit = false;
      }

      function isDefaultLayout() {
        return (!vm.gridsterDirtyBit && (UserService.getSetting('gridsterItems') === undefined));
      }

      function feeds() {
        return FeedsService.allFeeds();
      }

      function mainFeed() {
        return FeedsService.findMain();
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

      function adjustAllSizes() {
      }

      function showHotkeys() {
        hotkeys.toggleCheatSheet();
      }

      function toggleWindowResizeMode() {
        vm.windowResizeModeOn = !vm.windowResizeModeOn;
        vm.gridsterOpts.resizable.enabled = vm.windowResizeModeOn;
        vm.gridsterOpts.draggable.enabled = vm.windowResizeModeOn;

        if (!vm.windowResizeModeOn) { storeGridster(); }
      }

      function setDefaultLayout() {
        // A really ugly bug arises in my Firefox if we don't skip this case
        if (!isDefaultLayout()) {
          vm.gridsterIgnoreNextChange = true;
          vm.gridsterDirtyBit = false;
          vm.gridsterItems = defaultGridsterItems();
          UserService.removeSetting('gridsterItems');
          Notifier.info('Your layout preferences have been deleted');
        }
      }
    }
  }
})();
