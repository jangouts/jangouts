/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

jhUnpublishButton.$inject = ['RoomService'];

function jhUnpublishButton(RoomService) {
  return {
    restrict: 'EA',
    template: require('./jh-unpublish-button.html'),
    scope: {
      feed: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller: JhUnpublishButtonCtrl
  };

  function JhUnpublishButtonCtrl() {
    /* jshint: validthis */
    var vm = this;
    vm.click = click;
    vm.isVisible = isVisible;

    function click() {
      RoomService.unPublishFeed(vm.feed.id);
    }

    function isVisible() {
      return (vm.feed.isPublisher && vm.feed.isLocalScreen);
    }
  }
}

export default jhUnpublishButton;
