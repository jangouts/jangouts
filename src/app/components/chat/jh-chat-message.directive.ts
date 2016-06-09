/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

function jhChatMessageDirective() {
  return {
    restrict: 'EA',
    template: require('./jh-chat-message.html'),
    scope: {
      message: '='
    },
    controllerAs: 'vm',
    bindToController: true,
    controller: JhChatMessageCtrl
  };

  function JhChatMessageCtrl() {
    var vm = this;
    vm.embedOptions = {
      link: true,
      linkTarget: '_blank',
      image: {
        embed: true
      },
      pdf: {
        embed: false
      },
      audio: {
        embed: true
      },
      code: {
        highlight: false,
      },
      basicVideo: true,
      tweetEmbed: false
    };
  }
}

export default jhChatMessageDirective;
