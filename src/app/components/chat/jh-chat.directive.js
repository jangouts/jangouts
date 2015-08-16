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

  jhChatDirective.$inject = ['$window'];

  function jhChatDirective($window) {
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

      scope.vm.adjustHeight();
      angular.element($window).on('resize', function() {
        scope.vm.adjustHeight();
      });
    }

    function JhChatCtrl() {
      /* jshint validthis:true */
      var vm = this;
      vm.adjustHeight = adjustHeight;

      function adjustHeight() {
        var windowHeight;
        var footerHeight;
        var finalHeight;
        var shareBtnHeight;
        var footerChatHeight;
        var finalHeightChat;
        var tabsHeight;
        var headerHeight;
        var paddingBottom;

        windowHeight = $(window).outerHeight();
        footerHeight = $("footer").outerHeight();

        finalHeight = windowHeight - footerHeight;

        $("#chat-playroom").css({
          height: finalHeight + 'px'
        });

        //for the chat room the number needs to rest the share button div. 30 for the paddings.
        footerChatHeight = $("#chat-form-footer").outerHeight();
        shareBtnHeight = $(".share-help-btn").outerHeight();
        tabsHeight = $(".ng-isolate-scope .nav-tabs").outerHeight();
        headerHeight = $("header").outerHeight();

        //FIX: I cannot detect the height of footerChatHeight. For now the workaround is to add the 40px manually.

        paddingBottom = 15; //lets add a padding/margin so its not stuck to the footer.

        finalHeightChat = finalHeight - shareBtnHeight - 40 - tabsHeight - paddingBottom - headerHeight;

        $("#jh-chat-messages").css({
          height: finalHeightChat + 'px'
        });
      }
    }
  }
})();
