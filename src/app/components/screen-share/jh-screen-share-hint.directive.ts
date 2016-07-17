/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

jhScreenShareHintDirective.$inject = ['ScreenShareService', 'jhConfig'];

function jhScreenShareHintDirective(ScreenShareService, jhConfig) {
  return {
    restrict: 'EA',
    template: require('./jh-screen-share-hint.html'),
    scope: true,
    controllerAs: 'vm',
    bindToController: true,
    controller: JhScreenShareHintCtrl
  };

  function JhScreenShareHintCtrl() {
    /* jshint: validthis */
    var vm = this;

    vm.showHelp = function() { ScreenShareService.showHelp(); };
    vm.usingSSL = function() { return jhConfig.usingSSL(); };
    vm.httpsUrl = function() { return jhConfig.httpsUrl; };
    vm.visible = visible;

    function visible() {
      return (vm.usingSSL() || vm.httpsUrl());
    }
  }
}

export default jhScreenShareHintDirective;
