/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { NgModule }       from '@angular/core';
import { CommonModule }       from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { MODAL_BROWSER_PROVIDERS } from "angular2-modal/platform-browser";

import { AppComponent }   from './app.component';

import { ConfigService } from "./config.provider";
import {
  FeedsService,
  FEED_COMPONENTS
} from "./feed";
import {
  RoomService,
  DataChannelService,
  LogService,
  ActionService,
  ROOM_COMPONENTS,
} from "./room";

import { Broadcaster  } from "./shared";
import { ScreenShareService, ScreenShareButtonComponent } from "./screen-share";
import { StatesService } from "./router";
import { SigninFormComponent, UserService } from "./user";
import { NotificationComponent } from "./notification";
import { CHAT_COMPONENTS } from "./chat";
import { ThumbnailsModeButtonComponent } from "./videochat";
import { FooterComponent } from "./footer";

import { routing, appRoutingProviders } from "./app.routing";

@NgModule({
    declarations: [
      AppComponent,
      ROOM_COMPONENTS,
      SigninFormComponent,
      NotificationComponent,
      ThumbnailsModeButtonComponent,
      ScreenShareButtonComponent,
      NotificationComponent,
      CHAT_COMPONENTS,
      FEED_COMPONENTS
    ],
    imports: [
      BrowserModule,
      routing,     // router
      FormsModule, // forms
      HttpModule,
      CommonModule,
      JsonpModule
    ],
    providers: [
      appRoutingProviders,
      RoomService,
      ConfigService,
      DataChannelService,
      LogService,
      ActionService,
      FeedsService,
      StatesService,
      Broadcaster,
      ScreenShareService,
      UserService,
      MODAL_BROWSER_PROVIDERS
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
