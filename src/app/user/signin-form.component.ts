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


import { Component, OnInit, Inject, NgZone } from "@angular/core";

import {
  Control,
  ControlGroup,
  Validators,
  FORM_DIRECTIVES
} from "@angular/common";


import { RoomService, Room } from "../room";
import { ScreenShareHintComponent } from "../screen-share";
import { ThumbnailsModeButtonComponent } from "../videochat";
import { BrowserInfoComponent } from "../browser-info";
import { UserService } from "./user.service";

@Component({
  selector: "jh-signin-form",
  template: require("./signin-form.component.html"),
  directives: [
    FORM_DIRECTIVES,
    ScreenShareHintComponent,
    ThumbnailsModeButtonComponent,
    BrowserInfoComponent
  ]
})
export class SigninFormComponent implements OnInit {

  public rooms: Room[] = [];
  public room: Room = null;
  public showRoomsList: boolean = true;
  public loginForm: ControlGroup;


  constructor(private roomService: RoomService,
              private userService: UserService,
              private zone: NgZone,
              @Inject("$state") private state: any) {

    this.loginForm = new ControlGroup({
      username: new Control(null, Validators.required),
      room: new Control(null, Validators.required)
    });
  }

  public ngOnInit(): void {
    this.roomService.getRooms().then((rooms) => {
      this.room = this.roomService.getRoom();
      this.rooms = rooms;
      let username: string = null;

      if (this.userService.getUser() !== null) {
        username = this.userService.getUser().username;
      }

      if (this.room === null) {
        let lastRoomId: number = this.userService.getSetting("lastRoom");
        this.room = _.find(this.rooms, (room: Room) => {
          return room.id === lastRoomId;
        });
      }

      this.zone.run(() => {
        this.showRoomsList = this.room === null;

        // update form fields
        (<Control>this.loginForm.controls["username"]).updateValue(username);
        (<Control>this.loginForm.controls["room"]).updateValue(this.room);
      });
    });
  }

  public signin(): void {
    if (this.loginForm.value.room && this.loginForm.value.username) {
      this.state.go("room", {
        room: this.loginForm.value.room.id,
        user: this.loginForm.value.username
      });
    }
  }

}


