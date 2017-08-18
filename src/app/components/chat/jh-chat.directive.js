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

      // Scroll to the bottom of messages list.
      scope.$watch('vm.logEntries().length', function() {
        var messagesList = document.getElementById('chat-messages-box');
        setTimeout(function() {
          messagesList.scrollTop = messagesList.scrollHeight;
        }, 100);
      });

      // Update the chat messages count in the chat header.
      scope.$watch('vm.logEntries()', function(entries) {
        // True only at the beginning when there are no chat messages.
        if (entries.length === 0) {
          return;
        }
        // Filter out entries of type 'chatMsg' from all entries as we are not
        // interested in displaying logs (e.g. logging in or screen sharing).
        var newMessages = entries.slice(scope.entriesCount).filter(function(entry) {
          return entry.type === "chatMsg";
        });
        scope.messagesCount += newMessages.length;
        if (scope.isChatVisible) {
          scope.lastSeenMessage += scope.messagesCount;
        } else {
          var chatHeader = document.getElementById('chat-header');
          chatHeader.innerHTML = scope.messagesCount - scope.lastSeenMessage;
        }
        scope.entriesCount = entries.length;
      });

      // Change the text and style of the chat header depending on the number of
      // read/unread messages and whether it is open or not.
      scope.$watch('vm.isChatVisible', function(isVisible) {
        if (isVisible === undefined) {
          return;
        }
        var chatHeader = document.getElementById('chat-header');
        var unreadMessages = scope.messagesCount - scope.lastSeenMessage;
        var innerHTML;
        var cssClass;
        if (isVisible) {
          scope.isChatVisible = true;
          scope.lastSeenMessage = scope.messagesCount;
          innerHTML = "";
          if (unreadMessages === 0) {
            cssClass = "read";
          } else {
            cssClass = "unread";
          }
        } else {
          scope.isChatVisible = false;
          if (unreadMessages === 0) {
            innerHTML = "Click to open the chat!";
            cssClass = "read";
          } else if (unreadMessages === 1) {
            innerHTML = "1 unread message";
            cssClass = "unread";
          } else {
            innerHTML = unreadMessages + " unread messages";
            cssClass = "unread";
          }
        }
        chatHeader.innerHTML = innerHTML;
        $("#chat-header").toggleClass(cssClass);
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
