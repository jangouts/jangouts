/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule  } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";
import { AppComponent } from "./app.component";

import { ConfigService } from "./config.provider";

import {
  FeedsService,
  FEED_COMPONENTS,
  FEED_DIRECTIVES
} from "./feed";

import {
  RoomService,
  DataChannelService,
  LogService,
  ActionService,
  ROOM_COMPONENTS,
} from "./room";

import { Broadcaster  } from "./shared";
import { ScreenShareService, ScreenShareButtonComponent, ScreenShareHintComponent } from "./screen-share";
import { StatesService } from "./router";
import { SigninFormComponent, UserService } from "./user";
import { NotificationComponent } from "./notification";
import { CHAT_COMPONENTS } from "./chat";
import { ThumbnailsModeButtonComponent, VideoChatComponent } from "./videochat";
import { BlockUIComponent } from "./block-ui";
import { BrowserInfoComponent } from "./browser-info";
import { FooterComponent } from "./footer";

import { routing, appRoutingProviders } from "./app.routing";

@NgModule({
    declarations: [
      AppComponent,
      FooterComponent,
      ROOM_COMPONENTS,
      SigninFormComponent,
      NotificationComponent,
      ThumbnailsModeButtonComponent,
      VideoChatComponent,
      BlockUIComponent,
      BrowserInfoComponent,
      ScreenShareButtonComponent,
      ScreenShareHintComponent,
      NotificationComponent,
      CHAT_COMPONENTS,
      FEED_COMPONENTS,
      FEED_DIRECTIVES
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
      UserService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
