'use strict';

angular.module('janusHangouts', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    var authenticated = ['$q', '$state', 'UsersService', function($q, $state, UsersService) {
      return UsersService.currentUser();
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
  .run(function ($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function () {
      $state.go('signin');
    });
  });
