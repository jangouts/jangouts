(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhChatForm', jhChatFormDirective);

  function jhChatFormDirective() {
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
  }

  function JhChatFormCtrl($scope) {
    // jshint: validthis
    var vm = this;

    vm.text = null;

    vm.submit = function () {
      $scope.$emit('chat.submit', vm.text);
      vm.text = null;
    }
  }
})();
