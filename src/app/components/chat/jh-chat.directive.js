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

  function jhChatDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/chat/jh-chat.html',
      scope: {
        messages: '='
      },
      link: jhChatLink,
      controllerAs: 'vm',
      bindToController: true,
      controller: JhChatCtrl
    };

    function jhChatLink(scope) {
      scope.$watch('vm.messages.length', function(newVal) {
        /* Update messages */
        if (newVal !== undefined) {
          // Scroll to bottom of messages list.
          var messagesList = document.getElementById('jh-chat-messages');
          setTimeout(function() {
            messagesList.scrollTop = messagesList.scrollHeight;
          }, 100);
        }
      });
    }

    function JhChatCtrl() {}
  }
})();
