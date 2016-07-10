/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import { upgradeAdapter } from "../adapter";

import { Component, OnInit, Inject } from "@angular/core";

import { Room } from "./room.model";
import { RoomService } from "./room.service";

const jhVideoChat: any = upgradeAdapter.upgradeNg1Component("jhVideoChat");

interface IRoomParameters {
  room?: number;
  user?: string;
}

@Component({
  selector: "jh-room",
  template: require("./room.component.html"),
  directives: [
    jhVideoChat
  ]
})
export class RoomComponent implements OnInit {

  public room: Room;
  public user: any;
  public params: IRoomParameters = {};

  constructor(private roomService: RoomService,
              @Inject("hotkeys") private hotkeys: any,
              @Inject("UserService") private userService: any,
              @Inject("blockUI") private blockUI: any,
              @Inject("$state") private $state: any,
              @Inject("$scope") private $scope: any) {

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
      this.$state.go("signin", this.params);

    } else {
      if (this.$state.params.user === undefined) {
        /*
         * Make sure the url includes the user (to allow bookmarking)
         */
        this.params.room = this.room.id;
        this.params.user = this.user.username;
        this.$state.go(this.$state.current.name, this.params, {location: "replace"});

      } else {
        this.roomService.enter(this.user.username);
      }
    }

    this.setEvents();
    this.setKeybindings();
  }

  private setEvents(): void {
    this.$scope.$on("room.error", (evt: any, error: any): void => {
      // [FIXME] - do something neat
      alert("Janus server reported the following error:\n" + error);
    });

    this.$scope.$on("consentDialog.changed", (evt: any, open: boolean): void => {
      if (open) {
        this.blockUI.start();
      } else if (!open) {
        this.blockUI.stop();
      }
    });
  }

  private setKeybindings(): void {
    this.hotkeys.bindTo(this.$scope)
      .add({
        combo: "alt+m",
        description: "Mute or unmute your microphone",
        callback: (): void => { this.roomService.toggleChannel("audio"); }
      })
      .add({
        combo: "alt+n",
        description: "Disable or enable camera",
        callback: (): void => { this.roomService.toggleChannel("video"); }
      })
      .add({
        combo: "alt+q",
        description: "Sign out",
        callback: (): void => { this.userService.signout(); }
      });

    this.$scope.hotkeys = this.hotkeys;
  }
}
