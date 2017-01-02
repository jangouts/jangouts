/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";

import { Broadcaster } from "../shared";
import { BlockUIComponent} from "../block-ui";
import { VideoChatComponent } from "../videochat";
import { UserService } from "../user/user.service";

import { Room } from "./room.model";
import { RoomService } from "./room.service";

@Component({
  selector: "jh-room",
  template: require("./room.component.html"),
  entryComponents: [
    VideoChatComponent,
    BlockUIComponent
  ]
})
export class RoomComponent implements OnInit {

  public room: Room;
  public user: any;

  constructor(private roomService: RoomService,
              private broadcaster: Broadcaster,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {

  }

  public ngOnInit(): void {
    this.room = this.roomService.getRoom();
    this.user = this.userService.getUser();

    if (this.room === null || this.user === null) {
      /*
       * Redirect to signin making sure room is included in the url
       */
      let navigationExtras: NavigationExtras = {};
      if (this.room) {
          navigationExtras["queryParams"] = { "room": this.room.id}; // tslint:disable-line
      }
      this.router.navigate(["/sign_in"], navigationExtras);

    } else {
      /* Set last room */
      this.userService.setSetting("lastRoom", this.roomService.getRoom().id);


      if (this.user === null && this.route.snapshot.queryParams["user"] === undefined) { // tslint:disable-line
        /*
         * Make sure the url includes the user (to allow bookmarking)
         */

        let navigationExtras: NavigationExtras = {
          queryParams: { "user": this.user.username},
        };
        this.router.navigate(["/rooms", this.room.id], navigationExtras);

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

    // this.broadcaster.on("consentDialog.changed").subscribe((open: any): void => {
      // this.broadcaster.broadcast("blockUI", open);
    // });
  }

  private setKeybindings(): void {
    window.Mousetrap.bind("alt+m", (event: KeyboardEvent): boolean => {
      this.roomService.toggleChannel("audio");
      return false; // prevent bubbling
    });
    window.Mousetrap.bind("alt+n", (event: KeyboardEvent): boolean => {
      this.roomService.toggleChannel("video");
      return false; // prevent bubbling
    });

      /*
       * Signout was never implemented
      window.Mousetrap.bind("alt+q", (event: KeyboardEvent) => {
        this.userService.signout();
        return false; // prevent bubbling
      });
      */
  }
}
