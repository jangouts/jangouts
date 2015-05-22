/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

'use strict';

angular.module('janusHangouts', ['ngAnimate', 'ngCookies', 'ngTouch',
               'ngSanitize', 'blockUI', 'ui.router', 'ui.bootstrap', 'ngEmbed',
               'janusHangouts.config'])
  .config(function ($stateProvider, $urlRouterProvider) {
    var authenticated = ['$q', '$state', 'UserService', function($q, $state, UserService) {
      return UserService.currentUser();
    }];

    $stateProvider
      .state('signin', {
        url: '/sign_in',
        templateUrl: 'app/signin/signin.html',
        controller: 'SigninController',
        controllerAs: 'vm'
      })
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        resolve: {
          authenticated: authenticated,
        }
      });

    $urlRouterProvider.otherwise('/');
  })
  .config(function(blockUIConfig) {
    blockUIConfig.templateUrl = 'app/components/room/consent-dialog.html';
    blockUIConfig.cssClass = 'block-ui block-ui-anim-fade consent-dialog';
  })
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function () {
      $state.go('signin');
    });
  });
