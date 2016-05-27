/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

require('./vendor.scss');
require('./index.scss');

import config from './config.provider';
import room from './room/index';
import signin from './signin/index';

// Components
import roomComponent from './components/room/index';
import browserInfoComponent from './components/browser-info/index';
import chatComponent from './components/chat/index';
import feedComponent from './components/feed/index';
import notifierComponent from './components/notifier/index';
import routerComponent from './components/router/index';
import screenShareComponent from './components/screen-share/index';
import userComponent from './components/user/index';
import videochatComponent from './components/videochat/index';

angular.module('janusHangouts', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'blockUI',
    'ui.router',
    'ui.bootstrap',
    'ngEmbed',
    'cfp.hotkeys',
    'gridster',
    'ngAudio',
    'angular-extended-notifications',
    'LocalStorageModule',
    config.name,
    room.name,
    signin.name,
    roomComponent.name,
    browserInfoComponent.name,
    chatComponent.name,
    feedComponent.name,
    notifierComponent.name,
    routerComponent.name,
    screenShareComponent.name,
    userComponent.name,
    videochatComponent.name,
  ])
  .config(routesConfig)
  .config(blockUIConfig)
  .config(notificationsConfig)
  .config(localStorageConfig)
  .config(decorators)
  .run(getConfig)
  .run(stateEvents);

routesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function routesConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('signin', {
      url: '/sign_in?room',
      template: require('./signin/signin.html'),
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
      template: require('./room/room.html'),
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
}

blockUIConfig.$inject = ['blockUIConfig'];
function blockUIConfig(blockUIConfig) {
  blockUIConfig.template = require('./room/consent-dialog.html');
  blockUIConfig.cssClass = 'block-ui block-ui-anim-fade consent-dialog';
  blockUIConfig.autoBlock = false;
}

notificationsConfig.$inject = ['notificationsProvider'];
function notificationsConfig(notificationsProvider) {
  notificationsProvider.setDefaults({
    templatesDir: 'app/templates/',
    faIcons: true,
    closeOnRouteChange: 'state'
  });
}

localStorageConfig.$inject = ['localStorageServiceProvider'];
function localStorageConfig(localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('jh');
}

decorators.$inject = ['$provide'];
function decorators($provide) {
  // Decorate $state with parameters from the URL
  // so they're available when 'resolving':
  // http://stackoverflow.com/questions/22985988/angular-ui-router-get-state-info-of-tostate-in-resolve
  $provide.decorator('$state', function ($delegate, $rootScope) {
    $rootScope.$on('$stateChangeStart', function (event, state, params) {
      $delegate.toParams = params;
    });
    return $delegate;
  });
}

getConfig.$inject = ['$http', 'jhConfig'];
function getConfig($http, jhConfig) {
  //var request = new XMLHttpRequest();
  //request.open('GET', 'config.json', false);
  //request.send(null);
  let config = require('json!../config.json');
  //if (request.status === 200) {
  if (config) {
    //var config = JSON.parse(request.responseText);
    //var config = JSON.parse(response);
    angular.forEach(config, function(value, key) {
       jhConfig[key] = value;
    });
  } else {
    console.warn('No configuration found');
  }
}

stateEvents.$inject = ['$rootScope', '$state', 'RoomService'];
function stateEvents($rootScope, $state, RoomService) {
  $rootScope.$on('$stateChangeStart', function () {
    // Before changing state, cleanup feeds
    RoomService.leave();
  });
  $rootScope.$on('$stateChangeError', function () {
    $state.go('signin');
  });
}

angular.bootstrap(document.documentElement, ['janusHangouts']);
