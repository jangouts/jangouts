(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhChatForm', ['ActionService', jhChatFormDirective]);

  function jhChatFormDirective(ActionService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/chat/jh-chat-form.html',
      scope: {
        message: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhChatFormCtrl
    };

    function JhChatFormCtrl($scope) {
      // jshint: validthis
      var vm = this;

      vm.text = null;

      vm.submit = function () {
        ActionService.writeChatMessage(vm.text)
        vm.text = null;
      }
    }
  }

})();
