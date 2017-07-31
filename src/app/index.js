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
    // hotkeysProvider.template = '<div ng-include="'/templates/cheatsheet.html'"></div>';
    // hotkeysProvider.template = '<ng-include src="templates/cheatsheet.html"></ng-include>';
    hotkeysProvider.cheatSheetDescription = 'Show/hide this help menu.';
    hotkeysProvider.template =
      '<div class="cfp-hotkeys-container fade" ng-class="{in: helpVisible}" ng-click="toggleCheatSheet()">' +
        '<table>' +
          // Main Features
          '<tr>' +
            '<td><img src="../images/buttons/buttons_layout-change.svg"></td>' +
            '<td><p><span>Layout.&nbsp;</span>Toggles between the view with the main video and w/o.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_settings.svg"></td>' +
            '<td><p><span>Mute all.&nbsp;</span>Turns off microphone of all participants.</p></td>' +
          '</tr>' +
          '<tr>' +
          '<td></td>' +
          '<td><p><span>Video off for all.&nbsp;</span>Turns off camera of all participants.</p></td>' +
          '</tr>' +
          '<tr>' +
          '<td></td>' +
          '<td><p><span>Ignore all.&nbsp;</span>Makes all participants invisible.</p></td>' +
          '</tr>' +
          '<tr>' +
          '<td></td>' +
          '<td><p><span>Thumbnails Order.&nbsp;</span>Determines the order of the thumbnails based on the participants’ names or times when they joined the call.</p></td>' +
          '</tr>' +
          '<tr>' +
          '<td></td>' +
          '<td><p><span>Slow Connection Mode.&nbsp;</span>Turns on picture thumbnails to lower bandwith and CPU usage.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_hotkey.svg"></td>' +
            '<td><p><span>Hotkey.&nbsp;</span>Sets the push-to-talk key.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_audio-on.svg"></td>' +
            '<td><p><span>Audio on/off.&nbsp;</span>Turns on/off your microphone.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_video-on.svg"></td>' +
            '<td><p><span>Video on/off.&nbsp;</span>Turns on/off your camera.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_window-share.svg"></td>' +
            '<td><p><span>Window Share.&nbsp;</span>Turns on/off the screen sharing mode.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_screen-share.svg"></td>' +
            '<td><p><span>Screen Share.&nbsp;</span>Turns on the window sharing mode.</p></td>' +
          '</tr>' +
          '<tr><td></td><td><hr></td></tr>' +
          // Thumbnails Features
          '<tr>' +
            '<td><img src="../images/buttons/buttons_thumb-audio-on.svg"></td>' +
            '<td><p><span>Audio on/off.&nbsp;</span>Turns on/off microphone of a certain participant.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_thumb-video-on.svg"></td>' +
            '<td><p><span>Video on/off.&nbsp;</span>Turns on/off camera of a certain participant.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_thumb-ignore-off.svg"></td>' +
            '<td><p><span>Ignore.&nbsp;</span>Makes a certain participant invisible.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_thumb-pin-off.svg"></td>' +
            '<td><p><span>Pin.&nbsp;</span>Pushes a certain thumbnail to the top.</p></td>' +
          '</tr>' +
          '<tr>' +
            '<td><img src="../images/buttons/buttons_thumb-globalmute-off.svg"></td>' +
            '<td><p><span>Global Mute.&nbsp;</span>Turns on microphone of a certain participant so nobody can hear them.</p></td>' +
          '</tr>' +
          '<tr><td></td><td><hr></td></tr>' +
          // Shortcuts
          '<tr ng-repeat="hotkey in hotkeys | filter:{ description: \'!$$undefined$$\' }">' +
            '<td></td><td>' +
              '<p><span ng-repeat="key in hotkey.format() track by $index">{{ key }}</span>' +
            // '</td>' +
            '&nbsp;:&nbsp;{{ hotkey.description }}</p></td>' +
          '</tr>' +
        '</table>' +
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
