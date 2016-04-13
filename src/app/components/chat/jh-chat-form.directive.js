/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhChatForm', jhChatFormDirective);

  jhChatFormDirective.$inject = ['ActionService'];

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

    function JhChatFormCtrl() {
      var vm = this;
      vm.text = null;
      vm.submit = submit;

      function submit() {
        ActionService.writeChatMessage(vm.text);
        vm.text = null;
      }
    }
  }

})();
