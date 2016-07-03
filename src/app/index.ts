/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/*
 * Error with the exported typings from zone.js
 * https://github.com/angular/zone.js/issues/297#issuecomment-200912405
 */
//import "zone.js";
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";

import "reflect-metadata";
import { upgradeAdapter } from "./adapter";

require("./vendor.scss");
require("./index.scss");

import config from "./config.provider";
import signin from "./signin";

// Components
import chatComponent from "./chat";
import footerComponent from "./footer";
import feedComponent from "./feed";

import roomComponent from "./components/room";
import browserInfoComponent from "./components/browser-info";
import notifierComponent from "./components/notifier";
import routerComponent from "./components/router";
import screenShareComponent from "./components/screen-share";
import userComponent from "./components/user";
import videochatComponent from "./components/videochat";

angular.module("janusHangouts", [
    "ngAnimate",
    "ngCookies",
    "ngTouch",
    "ngSanitize",
    "blockUI",
    "ui.router",
    "ui.bootstrap",
    "ngEmbed",
    "cfp.hotkeys",
    "gridster",
    "ngAudio",
    "angular-extended-notifications",
    "LocalStorageModule",
    config.name,
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
		footerComponent.name
  ])
  .config(routesConfig)
  .config(blockUIConfig)
  .config(notificationsConfig)
  .config(localStorageConfig)
  .config(decorators)
  .run(getConfig)
  .run(stateEvents);

routesConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
function routesConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("signin", {
      url: "/sign_in?room",
      template: require("./signin/signin.html"),
      controller: "SigninController",
      controllerAs: "vm",
      resolve: {
        StatesService: "StatesService",
        setRoomAndService: ["StatesService", "$state", function (StatesService, $state) {
          return StatesService.setRoomAndUser($state.toParams);
        }]
      }
    })
    .state("room", {
      url: "/rooms/:room?user",
      template: "<jh-room></jh-room>
      resolve: {
        StatesService: "StatesService",
        setRoomAndService: ["StatesService", "$state", function (StatesService, $state) {
          return StatesService.setRoomAndUser($state.toParams);
        }]
      },
      onEnter: ["UserService", "RoomService", function (UserService, RoomService) {
        UserService.setSetting("lastRoom", RoomService.getRoom().id);
      }]
    });

  $urlRouterProvider.otherwise("/sign_in");
}

blockUIConfig.$inject = ["blockUIConfig"];
function blockUIConfig(blockUIConfig) {
  blockUIConfig.template = require("./room/consent-dialog.html");
  blockUIConfig.cssClass = "block-ui block-ui-anim-fade consent-dialog";
  blockUIConfig.autoBlock = false;
}

notificationsConfig.$inject = ["notificationsProvider"];
function notificationsConfig(notificationsProvider) {
  notificationsProvider.setDefaults({
    templatesDir: "app/templates/",
    faIcons: true,
    closeOnRouteChange: "state"
  });
}

localStorageConfig.$inject = ["localStorageServiceProvider"];
function localStorageConfig(localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix("jh");
}

decorators.$inject = ["$provide"];
function decorators($provide) {
  // Decorate $state with parameters from the URL
  // so they're available when 'resolving':
  // http://stackoverflow.com/questions/22985988/angular-ui-router-get-state-info-of-tostate-in-resolve
  $provide.decorator("$state", ["$delegate", "$rootScope", function ($delegate, $rootScope) {
    $rootScope.$on("$stateChangeStart", function (event, state, params) {
      $delegate.toParams = params;
    });
    return $delegate;
  }]);
}

getConfig.$inject = ["$http", "jhConfig"];
function getConfig($http, jhConfig) {
  var request = new XMLHttpRequest();
  request.open("GET", "config.json", false);
  request.send(null);
  if (request.status === 200) {
    var config = JSON.parse(request.responseText);
    angular.forEach(config, function(value, key) {
       jhConfig[key] = value;
    });
  } else {
    console.warn("No configuration found");
  }
}

stateEvents.$inject = ["$rootScope", "$state", "RoomService"];
function stateEvents($rootScope, $state, RoomService) {
  $rootScope.$on("$stateChangeStart", function () {
    // Before changing state, cleanup feeds
    RoomService.leave();
  });
  $rootScope.$on("$stateChangeError", function () {
    $state.go("signin");
  });
}


upgradeAdapter.bootstrap(document.documentElement, ["janusHangouts"], {
	strictDi: true
});
