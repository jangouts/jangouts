/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

jhPushToTalkButtonDirective.$inject = ['RoomService', 'hotkeys', '$timeout', 'UserService'];

function jhPushToTalkButtonDirective(RoomService, hotkeys, $timeout, UserService) {
  return {
    restrict: 'E',
    template: require('./jh-pushtotalk-button.html'),
    controllerAs: 'vm',
    controller: jhPushToTalkButtonCtrl,
    scope: {}
  };

  function jhPushToTalkButtonCtrl() {
    var titleText1 = "Set Push-to-talk hotkey";
    var titleText2 = "Disable Push-to-talk";
    var ignoreClick = false;

    var vm = this;
    vm.hotkeyActive = false;
    vm.showHotkey = false;
    vm.hotkey = null;
    vm.titleText = titleText1;

    vm.click = click;

    setLastHotkey();

    function setLastHotkey() {
      var lastHotkey = UserService.getSetting("lastHotkey");
      if (lastHotkey) {
        vm.hotkeyActive = true;
        setPushToTalk(lastHotkey);
      }
    }

    function click($event) {
      if (ignoreClick) {
        return;
      }

      $event.currentTarget.blur();

      if (vm.hotkeyActive) {
        if (vm.hotkey !== null) {
          setPushToTalk(null);
        } else {
          window.Mousetrap.stopRecord();
        }
        vm.hotkeyActive = false;
      } else {
        vm.hotkeyActive = true;
        recordSequence();
      }
    }

    function recordSequence() {
      vm.toggleText = "Choose a hotkey for Push-to-Talk...";

      var recordCallback = function(sequence) {
        vm.toggleText = "";

        if (sequence !== undefined && sequence !== null && sequence[0] !== undefined && sequence[0].length > 0) {
      //We don't want to support key combinations because the keyup event is not fired when the keys are released in wrong order.
      // This problem needs to be fixed in angular hotkeys / Mousetrap library. Second problem is broken support for the right super key.
            if (sequence[0].indexOf('+') > -1 && sequence[0].length !== 1 || sequence[0] === '\\') {
              warn("Sorry, key combinations are not supported!");
            } else {
              setPushToTalk(sequence[0]);
            }
        } else {
          vm.hotkeyActive = false;
        }
      };

      window.Mousetrap.record({
        recordSequence: false
      }, function(sequence) {
        recordCallback(sequence);
      });
    }

    function warn(warning) {
      vm.toggleText = warning;
      ignoreClick = true;

      var timeoutCallback = function() {
        vm.toggleText = "";
        vm.hotkeyActive = false;
        ignoreClick = false;
      };

      $timeout(timeoutCallback, 3000);
    }

    function setPushToTalk(key) {
      if (vm.hotkey !== null) {
        hotkeys.del(vm.hotkey, 'keydown');
        hotkeys.del(vm.hotkey, 'keyup');

        vm.hotkey = null;
        vm.showHotkey = false;
        vm.titleText = titleText1;
      }

      if (key !== null) {
        var pttCallback = function(event) {
          event.preventDefault();
          RoomService.pushToTalk(event.type);
        };

        hotkeys.add({
          combo: key,
          description: 'Push-to-talk',
          callback: pttCallback,
          action: 'keydown'
        });
        hotkeys.add({
          combo: key,
          description: 'Push-to-talk',
          callback: pttCallback,
          action: 'keyup'
        });

        vm.hotkey = key;
        vm.showHotkey = true;
        vm.titleText = titleText2;
      }

      UserService.setSetting("lastHotkey", key);
    }

  }

}

export default jhPushToTalkButtonDirective;

