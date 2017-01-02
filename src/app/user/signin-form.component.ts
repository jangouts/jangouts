/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

/* [TODO] - Move to directive */
/*
function adjustHeight() {
  var height = $(window).outerHeight() - $("footer").outerHeight();
  $("#signin").css({
    height: height + 'px'
  });
}
*/

/* [TODO] - Move to directive */
/*
function jhSigninFormLink(scope, element) {
  setTimeout(function() {
    $('#inputUsername', element).focus();
  }, 100);
  scope.vm.adjustHeight();
  $(window).on("resize", function() {
    scope.vm.adjustHeight();
  });
}
*/


import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";

import { RoomService, Room } from "../room";
import { ScreenShareHintComponent } from "../screen-share";
import { ThumbnailsModeButtonComponent } from "../videochat";
import { BrowserInfoComponent } from "../browser-info";
import { UserService } from "./user.service";

@Component({
  selector: "jh-signin-form",
  template: require("./signin-form.component.html"),
  entryComponents: [
    ScreenShareHintComponent,
    ThumbnailsModeButtonComponent,
    BrowserInfoComponent
  ]
})
export class SigninFormComponent implements OnInit {

  public rooms: Room[] = [];
  public room: Room = null;
  public username: string = null;
  public showRoomsList: boolean = true;


  constructor(private roomService: RoomService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public ngOnInit(): void {

    this.roomService.getRooms().then((rooms) => {
      this.room = this.roomService.getRoom();
      this.rooms = rooms;

      if (this.userService.getUser() !== null) {
        this.username = this.userService.getUser().username;
      }

      if (this.room === null) {
        let lastRoomId: number = this.userService.getSetting("lastRoom");
        this.room = _.find(this.rooms, (room: Room) => {
          return room.id === lastRoomId;
        });
      }

      this.showRoomsList = this.room === null;
    });
  }

  public signin(): void {
    if (this.room && this.username) {

      let navigationExtras: NavigationExtras = {
        queryParams: { "user": this.username},
      };

      this.router.navigate(["/rooms", this.room.id], navigationExtras);

    }
  }

}


