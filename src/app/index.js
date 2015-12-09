/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

'use strict';

angular.module('janusHangouts', ['ngAnimate', 'ngCookies', 'ngTouch',
               'ngSanitize', 'blockUI', 'ui.router', 'ui.bootstrap', 'ngEmbed',
               'janusHangouts.config', 'cfp.hotkeys', 'gridster',
               'ngAudio', 'angular-extended-notifications', 'LocalStorageModule'])
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
  .run(function ($rootScope, $state, RoomService) {
    $rootScope.$on('$stateChangeStart', function () {
      // Before changing state, cleanup feeds
      RoomService.leave();
    });
    $rootScope.$on('$stateChangeError', function () {
      $state.go('signin');
    });
  });
