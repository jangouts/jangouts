/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Injectable } from "@angular/core";

@Injectable()
export class LogEntry {

  public timestamp: Date;

  constructor(public t: string, public content: any = {}) {
    this.timestamp = new Date();
  }

  public text(): string {
    return this[this.t + "Text"]();
  }

  public muteRequestText(): string {
    let res: string;

    if (this.content.source.isPublisher) {
      res = "You have muted ";
    } else {
      res = this.content.source.display + " has muted ";
    }
    if (this.content.target.isPublisher) {
      res += "you";
    } else {
      res += this.content.target.display;
    }
    return res;
  }

  public chatMsgText(): string {
    // [REVIEW] - find how to sanitize with Angular2
    // return $sanitize(this.content.text).trim();
    return this.content.text;
  }

  public publishScreenText(): string {
    return "Screen sharing started";
  }
  public destroyFeedText(): string {
    if (this.content.feed.isLocalScreen) {
      return "Screen sharing stopped";
    } else {
      return this.content.feed.display + " has left the room";
    }
  }

  public newRemoteFeedText(): string {
    return this.content.feed.display + " has joined the room";
  }

  public ignoreFeedText(): string {
    return "You are ignoring " + this.content.feed.display + " now";
  }

  public stopIgnoringFeedText(): string {
    return "You are not longer ignoring " + this.content.feed.display;
  }

  public hasText(): boolean {
    return this.text() !== "";
  }

}

