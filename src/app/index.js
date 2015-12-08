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
               'angular-extended-notifications', 'ngAudio'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('signin', {
        url: '/sign_in?room',
        templateUrl: 'app/signin/signin.html',
        controller: 'SigninController',
        controllerAs: 'vm'
      })
      .state('room', {
        url: '/rooms/:room?user',
        templateUrl: 'app/room/room.html',
        controller: 'RoomCtrl'
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
      templatesDir: 'bower_components/angular-extended-notifications/templates/',
      faIcons: true,
      closeOnRouteChange: 'route'
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
