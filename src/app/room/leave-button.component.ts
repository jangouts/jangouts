/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
import { Component, OnInit, Inject } from "@angular/core";

import { RoomService } from "./room.service";

@Component({
  selector: "jh-leave-button",
  template: require("./leave-button.component.html")
})
export class LeaveButtonComponent implements OnInit {

  constructor(private roomService: RoomService,
             @Inject("$state") private $state: any) { }

  public ngOnInit(): void { }

  public leave(): void {
    this.roomService.setRoom(null);
    // stateChangeStart will take care of calling RoomService.leave()
    this.$state.go("signin");
  }
}
