/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit, Inject } from "@angular/core";

import {HotkeysService, Hotkey} from 'angular2-hotkeys';

import { RoomService } from "../../room";
import { UserService } from "../../user/user.service";

@Component({
  selector: "jh-pushtotalk-button",
  template: require("./pushtotalk.component.html")
})
export class PushToTalkComponent implements OnInit {

  public hotkeyActive: boolean = false;
  public showHotkey: boolean = false;
  public hotkey: Hotkey = null;
  public titleText: string = this.titleText1;
  public toggleText: string = null;

  private titleText1: string  = "Set Push-to-talk hotkey";
  private titleText2: string  = "Disable Push-to-talk";
  private ignoreClick: boolean = false;


  constructor(private roomService: RoomService,
              private userService: UserService,
              private hotkeys: HotkeysService) {
  }

  public ngOnInit (): void {
    this.setLastHotkey();
  }

  public click($event: any): void {
    if (this.ignoreClick) {
      return;
    }

    $event.currentTarget.blur();

    if (this.hotkeyActive) {
      if (this.hotkey !== null) {
        this.setPushToTalk(null);
      } else {
        window.Mousetrap.stopRecord();
      }
      this.hotkeyActive = false;
    } else {
      this.hotkeyActive = true;
      this.recordSequence();
    }
  }

  private setLastHotkey(): void {
    let lastHotkey: string = this.userService.getSetting("lastHotkey");
    if (lastHotkey) {
      this.hotkeyActive = true;
      this.setPushToTalk(lastHotkey);
    }
  }

  private recordSequence(): void {
    this.toggleText = "Choose a hotkey for Push-to-Talk...";

    let recordCallback: any = (sequence: Array<string>) => {
      this.toggleText = "";

      if (sequence !== undefined && sequence !== null && sequence[0] !== undefined && sequence[0].length > 0) {
        /*
         * We don't want to support key combinations because the keyup event is
         * not fired when the keys are released in wrong order. This problem
         * needs to be fixed in angular hotkeys / Mousetrap library. Second
         * problem is broken support for the right super key.
         */
        if (sequence[0].indexOf("+") > -1 && sequence[0].length !== 1 || sequence[0] === "\\") {
          this.warn("Sorry, key combinations are not supported!");
        } else {
          this.setPushToTalk(sequence[0]);
        }
      } else {
        this.hotkeyActive = false;
      }
    };

    window.Mousetrap.record({
      recordSequence: false
    }, recordCallback);
  }

  private warn(warning: string): void {
    this.toggleText = warning;
    this.ignoreClick = true;

    let timeoutCallback: any = (): void => {
      this.toggleText = "";
      this.hotkeyActive = false;
      this.ignoreClick = false;
    };

    setTimeout(timeoutCallback, 3000);
  }

  private setPushToTalk(key: string): void {
    if (this.hotkey !== null) {
      this.hotkeys.remove(this.hotkey);
      // [TODO] - angular2-hotkeys new update to suport keydown/keyup
      /*
       * this.hotkeys.remove(this.hotkey, "keydown");
       * this.hotkeys.remove(this.hotkey, "keyup");
       */

      this.hotkey = null;
      this.showHotkey = false;
      this.titleText = this.titleText1;
    }

    if (key !== null) {
      let pttCallback: any = (event: any): boolean => {
        event.preventDefault();
        this.roomService.pushToTalk(event.type);
        return false;  // prevent bubbling
      };

      this.hotkey = new Hotkey(key, pttCallback);
      this.hotkeys.add(this.hotkey);
      // [TODO] - angular2-hotkeys new update to suport keydown/keyup
      /*
       * this.hotkeys.add(new Hotkey(key, pttCallback, "keydown"));
       * this.hotkeys.add(new Hotkey(key, pttCallback, "keyup"));
       */

      this.showHotkey = true;
      this.titleText = this.titleText2;
    }

    this.userService.setSetting("lastHotkey", key);
  }

}
