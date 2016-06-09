/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

jhIgnoreButton.$inject = ['RoomService'];

function jhIgnoreButton(RoomService) {
  return {
    restrict: 'EA',
    template: require('./jh-ignore-button.html'),
    scope: {
      feed: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller: JhIgnoreButtonCtrl
  };

  function JhIgnoreButtonCtrl() {
    /* jshint: validthis */
    var vm = this;
    vm.ignore = ignore;
    vm.stopIgnoring = stopIgnoring;
    vm.showsIgnore = showsIgnore;
    vm.showsStopIgnoring = showsStopIgnoring;

    function showsIgnore() {
      return (!vm.feed.isPublisher && !vm.feed.isIgnored);
    }

    function showsStopIgnoring() {
      return vm.feed.isIgnored;
    }

    function ignore() {
      RoomService.ignoreFeed(vm.feed.id);
    }

    function stopIgnoring() {
      RoomService.stopIgnoringFeed(vm.feed.id);
    }
  }
}

export default jhIgnoreButton;
