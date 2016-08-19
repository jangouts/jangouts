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
import "zone.js/dist/zone";
import "zone.js/dist/long-stack-trace-zone";

import "reflect-metadata";

require("./vendor.scss");
require("./index.scss");

import { bootstrap } from "@angular/platform-browser-dynamic";
import { NgZone } from "@angular/core";

import { AppComponent } from "./app.component";
import { APP_ROUTER_PROVIDERS } from "./app.routing";
import { ConfigService } from "./config.provider";
import {
  DataChannelService,
  LogService,
  ActionService,
  RoomService
} from "./room";
import { FeedsService } from "./feed";
import { Broadcaster  } from "./shared";
import { ScreenShareService } from "./screen-share";
import { StatesService } from "./router";
import { MODAL_BROWSER_PROVIDERS } from "angular2-modal/platform-browser";
import { UserService } from "./user";

import { HotkeysService } from 'angular2-hotkeys';

bootstrap(AppComponent, [
	...APP_ROUTER_PROVIDERS,
	HotkeysService,
	ConfigService,
  DataChannelService,
  LogService,
  ActionService,
	FeedsService,
	Broadcaster,
	ScreenShareService,
	RoomService,
	UserService,
	//...MODAL_BROWSER_PROVIDERS
]);
