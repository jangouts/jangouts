/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
(function() {
    'use strict';

    angular.module('janusHangouts')
        .directive('jhPushtotalkButton', jhPushToTalkButtonDirective);

    jhPushToTalkButtonDirective.$inject = ['RoomService', 'hotkeys', '$timeout', 'UserService'];

    function jhPushToTalkButtonDirective(RoomService, hotkeys, $timeout, UserService) {
        return {
            restrict: 'E',
            templateUrl: 'app/components/feed/jh-pushtotalk-button.html',
            controllerAs: 'vm',
            controller: jhPushToTalkButtonCtrl,
            scope: {}
        };

        function jhPushToTalkButtonCtrl() {
            var titleText1 = "Set Push-to-talk hotkey or combination";
            var titleText2 = "Disable Push-to-talk";
            var ignoreClick = false;

            var restrictedSupport = false;
            var origHandleKey = null;
            var keyupDetected = false;
            var isCombination = false;
            var holding = true;
            var hooked = false;

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
                    if (lastHotkey.indexOf('+') > -1 && lastHotkey.length !== 1) {
                        isCombination = true;
                    }
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
                    mousetrapUnhook();
                } else {
                    vm.hotkeyActive = true;
                    recordSequence();
                }
            }

            function mousetrapHook() {
                if (hooked) {
                    return;
                }

                console.log("Hooking Mousetrap...");
                hooked = true;
                origHandleKey = window.Mousetrap.prototype.handleKey;
                var metapressed = false;

                window.Mousetrap.prototype.handleKey = function(character, modifiers, e) {

                    //we need this because the keyup event is not triggered when a combination is released in wrong order
                    if (e.type === 'keyup' && isCombination && holding) {
                        RoomService.pushToTalk('keyup');
                        holding = false;
                    }

                    // Right Super key fix for Firefox - we assume that we deal with Firefox(-based) browser when e.key is available
                    if (e.key) {
                        if (e.which === 91) {
                            restrictedSupport = true;
                            metapressed = true;
                        }
                        if (metapressed) {
                            modifiers.push("meta");
                        }
                        if (e.type === "keyup" && e.key === "OS") {
                            metapressed = false;
                        }

                        origHandleKey.call(this, character, modifiers, e);

                    } else {
                        //Right super key fix for Chrome browser - don't forward event for right super key; only needed for recording correctly
                        if (e.code !== "OSRight" && e.keyCode !== 91) {
                            origHandleKey.call(this, character, modifiers, e);
                        }

                    }
                };

            }

            function mousetrapUnhook() {
                if (!hooked) {
                    return;
                }

                console.log("Unhooking Mousetrap...");
                if (origHandleKey) {
                    window.Mousetrap.prototype.handleKey = origHandleKey;
                }
                origHandleKey = null;
                hooked = false;
            }

            function recordSequence() {
                vm.toggleText = "Choose a hotkey for Push-to-Talk...";

                var recordCallback = function(sequence) {
                    mousetrapUnhook();

                    vm.toggleText = "";
                    var forbiddenShortcuts = ['shift+[', 'alt+m', 'alt+n', 'alt+q'];

                    if (sequence !== undefined && sequence !== null && sequence[0] !== undefined && sequence[0].length > 0) {

                        if (forbiddenShortcuts.indexOf(sequence[0]) > -1) {
                            warn(1);

                        } else {
                            if (sequence[0].indexOf('+') > -1 && sequence[0].length !== 1) {
                                isCombination = true;
                            }
                            setPushToTalk(sequence[0]);
                            if (restrictedSupport) {
                                warn(2);
                            }
                        }

                    } else {
                        vm.hotkeyActive = false;
                    }
                };

                restrictedSupport = false;
                isCombination = false;
                mousetrapHook();

                window.Mousetrap.record({
                    recordSequence: false
                }, function(sequence) {
                    recordCallback(sequence);
                });
            }

            function warn(warning) {
                var timeoutCallback = null;
                switch (warning) {
                    case 1:
                        vm.toggleText = "This shortcut is already reserved!";
                        ignoreClick = true;
                        timeoutCallback = function() {
                            vm.toggleText = "";
                            vm.hotkeyActive = false;
                            ignoreClick = false;
                        };
                        break;

                    case 2:
                        vm.toggleText = "The support for this hotkey is restricted!";
                        ignoreClick = true;
                        vm.showHotkey = false;
                        timeoutCallback = function() {
                            vm.toggleText = "";
                            ignoreClick = false;
                            vm.showHotkey = true;
                        };
                        break;
                }

                $timeout(timeoutCallback, 3000);

            }



            function setPushToTalk(key) {
                if (!isCombination && hooked) {
                    mousetrapUnhook();
                }
                if (isCombination) {
                    mousetrapHook();
                }

                if (vm.hotkey !== null) {
                    hotkeys.del(vm.hotkey, 'keydown');
                    hotkeys.del(vm.hotkey, 'keyup');

                    vm.hotkey = null;
                    vm.showHotkey = false;
                    vm.titleText = titleText1;
                    mousetrapUnhook();
                }

                if (key !== null) {
                    var pttCallback = function(event) {
                        if (event.type === 'keyup') {
                            holding = false;
                        }
                        if (event.type === 'keydown') {
                            holding = true;
                        }
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
                    UserService.setSetting("lastHotkey", key);

                }
            }

        }

    }


})();
