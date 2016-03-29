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

    jhPushToTalkButtonDirective.$inject = ['$state', 'RoomService', 'hotkeys', '$timeout'];

    function jhPushToTalkButtonDirective($state, RoomService, hotkeys, $timeout) {
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

            var vm = this;
            vm.hotkeyActive = false;
            vm.showHotkey = false;
            vm.hotkey = null;
            vm.titleText = titleText1;

            vm.click = click;


            function click($event) {
                if (ignoreClick)
                    return;

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
                    var forbiddenShortcuts = ['shift+[', 'alt+m', 'alt+n', 'alt+q'];

                    if (sequence !== undefined && sequence !== null && sequence[0] !== undefined && sequence[0].length > 0) {

                        if (forbiddenShortcuts.indexOf(sequence[0]) > -1) {
                            vm.toggleText = "This shortcut is already reserved!";
                            ignoreClick = true;
                            var timeoutCallback = function() {
                                vm.toggleText = "";
                                vm.hotkeyActive = false;
                                ignoreClick = false;
                            };
                            $timeout(timeoutCallback, 3000);
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
            }

        }

    }


})();
