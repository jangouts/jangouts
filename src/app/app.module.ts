import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent }   from './app.component';

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

import { RoomComponent } from "./room";
import { FooterComponent } from "./footer";
import { SigninFormComponent } from "./user";

import { routing } from "./app.routing";

@NgModule({
    declarations: [
      AppComponent,
      RoomComponent,
      SigninFormComponent
    ],
    imports: [
      BrowserModule,
      // Router
      routing,
      // Forms
      FormsModule,
      HttpModule,
      JsonpModule
    ],
    providers: [
      HotkeysService,
      ConfigService,
      DataChannelService,
      LogService,
      ActionService,
      FeedsService,
      Broadcaster,
      ScreenShareService,
      RoomService,
      UserService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
