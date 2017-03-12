/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhNameeditButton', jhNameeditButton);

  jhNameeditButton.$inject = ['RoomService', 'DataChannelService'];

  function jhNameeditButton(RoomService, DataChannelService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/feed/buttons/jh-nameedit-button.html',
      scope: {
        feed: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhNameeditButtonCtrl
    };

    function JhNameeditButtonCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.isEditable = isEditable;
      vm.toggleEditingMode = toggleEditingMode;
      vm.editing = false; /* Name Editing mode */
      vm.isEditing = isEditing;
      vm.updateName = updateName;

      /**
       * Toggles the name editing mode
       *
       */
      function toggleEditingMode() {
        vm.editing = !vm.editing;
        vm.newName = null;
      }
      
      /**
       * Checks if the user is publisher (to allow editing)
       *
       * @returns {boolean}
       */
      function isEditable() {
        return (vm.feed && vm.feed.isPublisher);
      }
      
      /**
       * Checks if the user is currently editing name or not
       *
       * @returns {boolean}
       */
      function isEditing() {
        console.log("Current editing value", vm.editing);
        return vm.editing;
      }
      
      /**
       * Update the name
       *
       */
      function updateName() {
        if (vm.newName) {
            
        }
        vm.newName = null;
      }
    }
  }
})();
