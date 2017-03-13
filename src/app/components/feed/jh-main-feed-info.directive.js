/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhMainFeedInfo', jhMainFeedInfoDirective);

  jhMainFeedInfoDirective.$inject = ['FeedsService', '$state'];

  function jhMainFeedInfoDirective(FeedsService, $state) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/jh-main-feed-info.html',
      scope: {},
      controllerAs: 'vm',
      bindToController: true,
      controller: jhMainFeedInfoCtrl
    };

    function jhMainFeedInfoCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.name = name;
      vm.makeNameEditable = makeNameEditable;
      vm.leaveEditingMode = leaveEditingMode;
      vm.editing = false; /* Name Editing mode */
      vm.isEditing = isEditing;
      vm.updateName = updateName;
      vm.newName = null;
      vm.keyDetect = keyDetect;

      function name() {
        var feed = FeedsService.findMain();
        var name = (feed !== null) ? feed.display : "";
        return name;
      }

      /**
       * Detects the key pressed by user
       * @param {Number} - numeric keycode
       */
      function keyDetect(event) {
        // if keypressed is 'Enter'
        // then update the name to the current value in input box
        console.log("This is detected keycode", event);
        if (event.keyCode === 13) {
          vm.updateName();
          vm.leaveEditingMode();
        // if keypressed is 'Escape'
        // then leave the editing mode without changing name
        } else if (event.keyCode === 27) {
          vm.leaveEditingMode();
        }
      }
      
      /**
       * Toggles the name editing mode
       *
       */
      function leaveEditingMode() {
        vm.editing = false;
        vm.newName = null;
      }
      
      /**
       * Allows editing the name on double-click
       * 
       */
      function makeNameEditable() {
        vm.editing = true;
      }
      
      /**
       * Checks if the user is currently editing name or not
       *
       * @returns {boolean}
       */
      function isEditing() {
        return vm.editing;
      }
      
      /**
       * Update the name
       * 
       */
      function updateName() {
        if (vm.newName) {
          FeedsService
            .findMain()
            .updateDisplay(vm.newName);
          $state.go('room', {user: vm.newName}, {notify: false});
        }
        this.leaveEditingMode();
      }
    }
  }
})();
