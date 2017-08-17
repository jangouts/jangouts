/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhChat', jhChatDirective);

    jhChatDirective.$inject = ['LogService'];

  function jhChatDirective(LogService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/chat/jh-chat.html',
      scope: {
        message: '='
      },
      link: jhChatLink,
      controllerAs: 'vm',
      bindToController: true,
      controller: JhChatCtrl
    };

    function jhChatLink(scope) {
      scope.entriesCount = 0;       // number of all types of entries
      scope.messagesCount = 0;      // number of entries of type 'chatMsg'
      scope.lastSeenMessage = 0;    // last seen entry of type 'chatMsg'
      scope.isChatVisible = false;

      scope.$watch('vm.logEntries().length', function() {
        // Scroll to bottom of messages list.
        var messagesList = document.getElementById('chat-messages-box');
        setTimeout(function() {
          messagesList.scrollTop = messagesList.scrollHeight;
        }, 100);
      });

      scope.$watch('vm.logEntries()', function(entries) {
        // True only at the beginning when there are no chat messages
        if (entries.length === 0) {
          return;
        }

        // Update the chat messages count
        for (var i = scope.entriesCount; i < entries.length; i++) {
          if (entries[i].type === 'chatMsg') {
            scope.messagesCount++;
            if (scope.isChatVisible) {
              scope.lastSeenMessage++;
            } else {
              var chatHeader = document.getElementById('chat-header');
              chatHeader.innerHTML = scope.messagesCount - scope.lastSeenMessage;
            }
          } else {
            // We don't notify the user when the entry is not of type 'chatMsg'
          }
        }
        scope.entriesCount = entries.length;
      });

      scope.$watch('vm.isChatVisible', function(isVisible) {
        if (isVisible === undefined) {
          return;
        }
        var chatHeader = document.getElementById('chat-header');
        if (isVisible) {
          scope.isChatVisible = true;
          scope.lastSeenMessage = scope.messagesCount;
          chatHeader.innerHTML = ""; // Display nothing when chat is open
        } else {
          scope.isChatVisible = false;
          if (scope.messagesCount === 0) {
            chatHeader.innerHTML = "Join the chat!";
          } else if ((scope.messagesCount - scope.lastSeenMessage) === 1) {
            chatHeader.innerHTML = "1 unread message";
          } else {
            chatHeader.innerHTML = (scope.messagesCount - scope.lastSeenMessage) + " unread messages";
          }
        }
      });
    }

    function JhChatCtrl() {
      var vm = this;

      vm.isChatVisible = false;

      vm.toggleChat = toggleChat;
      vm.logEntries = logEntries;

      // XXX: Maybe it is possible to get the element we want to toggle
      // directly from Angular instead of using jQuery here.
      function toggleChat() {
        $("#chat-wrapper").toggleClass("toggled");
        if (vm.isChatVisible) {
          vm.isChatVisible = false;
        } else {
          vm.isChatVisible = true;
        }
      }

      function logEntries() {
        return LogService.allEntries();
      }
    }
  }
})();
