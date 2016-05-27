/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

jhThumbnailsModeButtonDirective.$inject = ['jhConfig', '$timeout'];

function jhThumbnailsModeButtonDirective(jhConfig, $timeout) {
  return {
    restrict: 'EA',
    template: function(elem, attrs) {
      if (attrs.textTemplate) {
        return require('./jh-thumbnails-mode-button-with-text.html');
      } else {
        return require('./jh-thumbnails-mode-button.html');
      }
    },
    scope: {},
    controllerAs: 'vm',
    bindToController: true,
    controller: jhThumbnailsModeButtonCtrl
  };

  function jhThumbnailsModeButtonCtrl() {
    /* jshint: validthis */
    var vm = this;

    vm.click = click;
    vm.isChecked = isChecked;

    function click() {
      $timeout(function() {
        jhConfig.videoThumbnails = !jhConfig.videoThumbnails;
      });
    }

    function isChecked() {
      return jhConfig.videoThumbnails;
    }
  }
}

export default jhThumbnailsModeButtonDirective;
