/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

'use strict';

angular.module('janusHangouts', ['ngAnimate', 'ngCookies', 'ngTouch',
               'ngSanitize', 'blockUI', 'ui.router', 'ui.bootstrap', 'ngEmbed',
               'janusHangouts.config', 'cfp.hotkeys', 'gridster', 'toastr', 'ngAudio'])
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('signin', {
        url: '/sign_in',
        templateUrl: 'app/signin/signin.html',
        controller: 'SigninController',
        controllerAs: 'vm'
      })
      .state('home', {
        url: '/:user/:room',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/sign_in');
  })
  .config(function(blockUIConfig) {
    blockUIConfig.templateUrl = 'app/components/room/consent-dialog.html';
    blockUIConfig.cssClass = 'block-ui block-ui-anim-fade consent-dialog';
  })
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function () {
      $state.go('signin');
    });
  })
  .run(function (RemoteLoggingService, jhConfig) {
    if (typeof jhConfig.remoteLogger === 'string') {
      RemoteLoggingService.setUrl(jhConfig.remoteLogger);
    }
  });
