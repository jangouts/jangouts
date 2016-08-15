/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import { Component, OnInit, Inject } from "@angular/core";

import {HotkeysService, Hotkey} from 'angular2-hotkeys';

import { Broadcaster } from "../shared";
import { BlockUIComponent} from "../block-ui";
import { VideoChatComponent } from "../videochat";
import { UserService } from "../user/user.service";

import { Room } from "./room.model";
import { RoomService } from "./room.service";


// [TODO] - Remove when router migrated
function getParameterByName(name: string, url?: string) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results || !results[2]) return undefined;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

interface IRoomParameters {
  room?: number;
  user?: string;
}

@Component({
  selector: "jh-room",
  template: require("./room.component.html"),
  directives: [
    VideoChatComponent,
    BlockUIComponent
  ],
  providers : [HotkeysService]
})
export class RoomComponent implements OnInit {

  public room: Room;
  public user: any;
  public params: IRoomParameters = {};

  constructor(private roomService: RoomService,
              private broadcaster: Broadcaster,
              private userService: UserService,
              private hotkeys: HotkeysService) {

    this.room = this.roomService.getRoom();
    this.user = this.userService.getUser();
  }

  public ngOnInit(): void {
    if (this.room === null || this.user === null) {
      /*
       * Redirect to signin making sure room is included in the url
       */
      if (this.room !== null) {
        this.params.room = this.room.id;
      }
      // [TODO] - Until routes migrated to angular2
      let url: string = `/sign_in?room=${this.params.room}`;
      window.location.hash = url;
      /* Old code
       * this.$state.go("signin", this.params);
       */

    } else {
      /* Set last room */
      this.userService.setSetting("lastRoom", this.roomService.getRoom().id);

      // if (this.$state.params.user === undefined) {
      if (getParameterByName("user") === undefined) {
        /*
         * Make sure the url includes the user (to allow bookmarking)
         */
        this.params.room = this.room.id;
        this.params.user = this.user.username;

        // [TODO] - Until routes migrated to angular2
        let url: string = `/rooms/${this.params.room}?user=${this.params.user}`;
        window.location.hash = url;
        /* Old code
         * this.$state.go(this.$state.current.name, this.params, {location: "replace"});
         */

      } else {
        this.roomService.enter(this.user.username);
      }
    }

    this.setEvents();
    this.setKeybindings();
  }

  private setEvents(): void {
    this.broadcaster.on("room.error").subscribe((error: any): void => {
      // [FIXME] - do something neat
      alert("Janus server reported the following error:\n" + error);
    });

    //this.broadcaster.on("consentDialog.changed").subscribe((open: any): void => {
      //console.log("consentDialog.changed", open);
      //this.broadcaster.broadcast("blockUI", open);
    //});
  }

  private setKeybindings(): void {
    this.hotkeys.add(new Hotkey("alt+m", (event: KeyboardEvent): boolean => {
        this.roomService.toggleChannel("audio");
        return false; // prevent bubbling
      }));
      this.hotkeys.add(new Hotkey("alt+n", (event: KeyboardEvent): boolean => {
        this.roomService.toggleChannel("video");
        return false; // prevent bubbling
      }));

      /*
       * Signout was never implemented
      this.hotkeys.add(new Hotkey("alt+q", (event: KeyboardEvent) => {
        this.userService.signout();
        return false; // prevent bubbling
      }));
      */
  }
}
