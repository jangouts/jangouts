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
      scope.messagesCount = 0;
      scope.lastSeenMessage = 0;
      scope.isChatVisible = false;

      scope.$watch('vm.logEntries().length', function(newMessageCount) {

        // True only at the beginning when there are no chat messages
        if (newMessageCount === undefined) {
          return;
        }
        // Scroll to bottom of messages list.
        var messagesList = document.getElementById('chat-messages-box');
        setTimeout(function() {
          messagesList.scrollTop = messagesList.scrollHeight;
        }, 100);

        // Update the chat message count
        scope.messagesCount = newMessageCount;
        var chatHeader = document.getElementById('chat-header');
        chatHeader.innerHTML = scope.messagesCount-scope.lastSeenMessage;
      });

      scope.$watch('vm.messagesCount', function() {
        // var chatHeader = document.getElementById('chat-header');
        // chatHeader.innerHTML = scope.messagesCount-scope.lastSeenMessage;
      });

      scope.$watch('vm.isChatVisible', function(isVisible) {
        if (isVisible === undefined) {
          return;
        }
        var chatHeader = document.getElementById('chat-header');
        if (isVisible) {
          scope.isChatVisible = true;
          scope.lastSeenMessage = scope.messagesCount;
          chatHeader.innerHTML = scope.messagesCount-scope.lastSeenMessage;
        } else {
          scope.isChatVisible = false;
          chatHeader.innerHTML = "";
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
