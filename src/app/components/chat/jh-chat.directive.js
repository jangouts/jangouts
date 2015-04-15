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
      controllerAs: 'vm',
      bindToController: true,
      controller: JhChatCtrl
    };
  }

  function JhChatCtrl() {
    /* jshint: validthis */
    var vm = this;
  }
})();
