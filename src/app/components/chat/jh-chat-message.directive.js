/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhChatMessage', jhChatMessageDirective);

  function jhChatMessageDirective() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/chat/jh-chat-message.html',
      scope: {
        message: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhChatMessageCtrl
    };

    function JhChatMessageCtrl() {
      /* jshint validthis:true */
      var vm = this;
      vm.emoticonsOptions = {
        link: true,
        linkTarget: '_blank',
        image: {
          embed: true
        },
        pdf: {
          embed: false
        },
        audio: {
          embed: false
        },
        code: {
          highlight: false,
        },
        basicVideo: false
      };
    }
  }
})();
