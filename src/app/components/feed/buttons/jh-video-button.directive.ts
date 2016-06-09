/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

jhVideoButton.$inject = ['RoomService'];

function jhVideoButton(RoomService) {
  return {
    restrict: 'EA',
    template: require('./jh-video-button.html'),
    scope: {
      feed: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller: JhVideoButtonCtrl
  };

  function JhVideoButtonCtrl() {
    /* jshint: validthis */
    var vm = this;
    vm.toggle = toggle;
    vm.showsEnable =showsEnable;
    vm.showsDisable = showsDisable;

    function toggle() {
      RoomService.toggleChannel("video", vm.feed);
    }

    function showsEnable() {
      return (vm.feed.isPublisher && !vm.feed.getVideoEnabled());
    }

    function showsDisable() {
      return (vm.feed.isPublisher && vm.feed.getVideoEnabled());
    }
  }
}

export default jhVideoButton;
