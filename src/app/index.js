/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

'use strict';

angular.module('janusHangouts', ['ngAnimate', 'ngCookies', 'ngTouch',
               'ngSanitize', 'blockUI', 'ui.router', 'ui.bootstrap', 'ngEmbed',
               'janusHangouts.config', 'cfp.hotkeys', 'ngAudio',
               'angular-extended-notifications', 'LocalStorageModule'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('signin', {
        url: '/sign_in?room',
        templateUrl: 'app/signin/signin.html',
        controller: 'SigninController',
        controllerAs: 'vm',
        resolve: {
          StatesService: 'StatesService',
          setRoomAndService: function (StatesService, $state) {
            return StatesService.setRoomAndUser($state.toParams);
          }
        }
      })
      .state('room', {
        url: '/rooms/:room?user',
        templateUrl: 'app/room/room.html',
        controller: 'RoomCtrl',
        resolve: {
          StatesService: 'StatesService',
          setRoomAndService: function (StatesService, $state) {
            return StatesService.setRoomAndUser($state.toParams);
          }
        },
        onEnter: function (UserService, RoomService) {
          UserService.setSetting("lastRoom", RoomService.getRoom().id);
        }
      });

    $urlRouterProvider.otherwise('/sign_in');
  })
  .config(function(blockUIConfig) {
    blockUIConfig.templateUrl = 'app/room/consent-dialog.html';
    blockUIConfig.cssClass = 'block-ui block-ui-anim-fade consent-dialog';
    blockUIConfig.autoBlock = false;
  })
  .config(function(notificationsProvider) {
    notificationsProvider.setDefaults({
      templatesDir: 'app/templates/',
      faIcons: true,
      closeOnRouteChange: 'state'
    });
  })
  .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('jh');

  }])
  .config(function ($provide) {
    // Decorate $state with parameters from the URL
    // so they're available when 'resolving':
    // http://stackoverflow.com/questions/22985988/angular-ui-router-get-state-info-of-tostate-in-resolve
    $provide.decorator('$state', function ($delegate, $rootScope) {
      $rootScope.$on('$stateChangeStart', function (event, state, params) {
        $delegate.toParams = params;
      });
      return $delegate;
    });
  })
  .config(function(hotkeysProvider) {
    hotkeysProvider.cheatSheetDescription = 'Show/hide this help menu.';
    hotkeysProvider.template =
      '<div class="cfp-hotkeys-container fade" ng-class="{in: helpVisible}" ng-click="toggleCheatSheet()">' +
        // Main Features
        '<div class="left-item"><img src="../images/buttons/buttons_layout-change.svg"></div>' +
        '<div class="right-item"><p><span>Layout.</span>Toggles between the view with the main video and w/o.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_settings.svg"></div>' +
        '<div class="right-item">' +
          '<p><span>Mute all.</span>Turns off microphones of all participants.</p>' +
          '<p><span>Video off for all.</span>Turns off cameras of all participants.</p>' +
          '<p><span>Ignore all.</span>Makes all participants invisible.</p>' +
          '<p><span>Thumbnails Order.</span>Determines the order of the thumbnails based on the participants’ names or the time they joined the call.</p>' +
          '<p><span>Slow Connection Mode.</span>Turns on picture thumbnails to lower bandwith and CPU usage.</p>' +
        '</div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_hotkey.svg"></div>' +
        '<div class="right-item"><p><span>Hotkey.</span>Sets the push-to-talk key.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_audio-on.svg"></div>' +
        '<div class="right-item"><p><span>Audio.</span>Turns on/off your microphone.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_video-on.svg"></div>' +
        '<div class="right-item"><p><span>Video.</span>Turns on/off your camera.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_window-share.svg"></div>' +
        '<div class="right-item"><p><span>Window Share.</span>Turns on/off the window sharing mode.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_screen-share.svg"></div>' +
        '<div class="right-item"><p><span>Screen Share.</span>Turns on/off the screen sharing mode.</p></div>' +
        '<hr>' +
        // Thumbnails Features
        '<div class="left-item"><img src="../images/buttons/buttons_thumb-audio-on.svg"></div>' +
        '<div class="right-item"><p><span>Audio.</span>Turns on/off a microphone of a certain participant.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_thumb-video-on.svg"></div>' +
        '<div class="right-item"><p><span>Video.</span>Turns on/off a camera of a certain participant.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_thumb-ignore-off.svg"></div>' +
        '<div class="right-item"><p><span>Ignore.</span>Makes a certain participant invisible.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_thumb-pin-off.svg"></div>' +
        '<div class="right-item"><p><span>Pin.</span>Pushes a certain thumbnail to the top.</p></div>' +
        '<div class="left-item"><img src="../images/buttons/buttons_thumb-globalmute-off.svg"></div>' +
        '<div class="right-item"><p><span>Global Mute.</span>Turns off a microphone of a certain participant so nobody in the call can hear them.</p></div>' +
        '<hr>' +
        // Shortcuts
        '<div class="right-item" ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }">' +
          '<p><span ng-repeat="key in hotkey.format() track by $index">{{ key }}</span>: {{ hotkey.description }}</p>' +
        '</div>' +
        // Close Button
        '<div ng-bind-html="footer" ng-if="footer"></div>' +
        '<div class="cfp-hotkeys-close">×</div>' +
      '</div>';
  })
  .run(function($http, jhConfig) {
    //function to replace the placeholders

    function replacePlaceholder(value) {
      if (typeof value === 'string') {
          return value.replace("%{hostname}", window.location.host);
      }

      return value;
    }

    var request = new XMLHttpRequest();
    request.open('GET', 'config.json', false);
    request.send(null);
    if (request.status === 200) {
      var config = JSON.parse(request.responseText);
      angular.forEach(config, function (value, key) {
        //assigning config value with replaced value of placeholder
        jhConfig[key] = replacePlaceholder(value);
      });
    } else {
      console.warn('No configuration found');
    }
  })
  .run(function ($rootScope, $state, RoomService) {
    $rootScope.$on('$stateChangeStart', function () {
      // Before changing state, cleanup feeds
      RoomService.leave();
    });
    $rootScope.$on('$stateChangeError', function () {
      $state.go('signin');
    });
  });
