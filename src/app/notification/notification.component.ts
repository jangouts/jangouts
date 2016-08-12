/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit } from "@angular/core";

import { Broadcaster } from "../shared";
import { ActionService } from "../room";
import { ConfigService } from "../config.provider";

@Component({
  selector: "jh-notification",
  template: require("./notification.component.html")
})
export class NotificationComponent implements OnInit {

  public notification: string = null;
  private mutedWarningTimeout: number = 0;
  private noShow: any = {};

  constructor(private broadcaster: Broadcaster,
              private config: ConfigService,
              private actionService: ActionService) {
    /*
     * Until this timeout is reached, the "you are muted" notification
     *  will not be displayed again.
     */
    this.mutedWarningTimeout = this.now();
  }

  public ngOnInit(): void {
    this.broadcaster.on("muted.byRequest").subscribe((data: any) => {
      this.mutedByRequest();
    });
    this.broadcaster.on("muted.byUser").subscribe((data: any) => {
      this.mutedByUser();
    });
    this.broadcaster.on("muted.Join").subscribe((data: any) => {
      this.joinedMuted();
    });
    this.broadcaster.on("speaking").subscribe((data: any) => {
      this.speaking();
    });
    this.broadcaster.on("dismissLastNotification").subscribe((data: any) => {
      this.closeNotification();
    });
  }

  public unmute(ev: any): void {
    this.actionService.toggleChannel("audio");
    this.closeNotification();
  }

  public dontShowAgain(ev: any): void {
    this.noShow[this.notification] = true;
    this.closeNotification();
  }

  private speaking(): void {
    /*
     * Display warning only if the timeout has been reached
     */
    this.mutedWarningTimeout = this.secondsFromNow(60);
    this.info("Trying to say something? You are muted.");
  }

  private mutedByRequest(): void {
    this.mutedWarningTimeout = this.secondsFromNow(3);
  }

  private mutedByUser(): void {
    this.mutedWarningTimeout = this.now();  // reset the warning timeout
    this.info("You have been muted by another user.");
  }

  private joinedMuted(): void {
    this.mutedWarningTimeout = this.now();

    let notiftext: string = "You are muted because ";

    if (this.config.joinUnmutedLimit === 0) {
      notiftext += "everyone who enters a room is muted by default.";
    } else {
      if (this.config.joinUnmutedLimit === 1) {
        notiftext +=  "there is already one participant in the room.";
      } else {
        notiftext += `there are already ${this.config.joinUnmutedLimit} participants in the room.`;
      }
    }

    this.info(notiftext);
  }

  private info(text: string): void {
    if (text in this.noShow || this.notification) {
      return;
    }
    this.notification = text;

    // clean notification after timeout
    setTimeout(this.closeNotification, 20000);
  }

  private closeNotification(): void {
    this.notification = null;
  }

  private secondsFromNow(sec: number): number {
    return Date.now() + sec * 1000;
  }

  private now(): number {
    return this.secondsFromNow(0);
  }

}
