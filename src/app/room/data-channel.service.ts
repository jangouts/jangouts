/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Injectable } from "@angular/core";

import { LogEntry } from "./logentry.model";
import { LogService } from "./log.service";
import { Feed, FeedsService } from "../feed";

@Injectable()
export class DataChannelService {

  constructor(private feedsService: FeedsService, private logService: LogService) { }

  public receiveMessage(data: string, remoteId: number): void {
    let msg: any = JSON.parse(data);
    let type: string = msg.type;
    let content: any = msg.content;
    let feed: Feed;
    let logEntry: LogEntry;

    if (type === "chatMsg") {

      logEntry = new LogEntry("chatMsg", {
        feed: this.feedsService.find(remoteId),
        text: content
      });

      if (logEntry.hasText()) {
        this.logService.add(logEntry);
      }

    } else if (type === "muteRequest") {

      feed = this.feedsService.find(content.target);

      if (feed.isPublisher) {

        // [TODO] - Enable broadcast 'muted.byRequest'
        feed.setEnabledChannel("audio", false, {});
        // feed.setEnabledChannel("audio", false, {
          // after: () => { $rootScope.$broadcast('muted.byRequest'); }
        // });
      }

      // log the event
      logEntry = new LogEntry("muteRequest", {
        source: this.feedsService.find(remoteId),
        target: feed
      });
      this.logService.add(logEntry);

    } else if (type === "statusUpdate") {

      feed = this.feedsService.find(content.source);

      if (feed && !feed.isPublisher) {
        feed.setStatus(content.status);
      }

    } else {
      console.log("Unknown data type: " + type);
    }
  }

  public sendMuteRequest(feed: Feed): void {
    let content: any = {
      target: feed.id,
    };

    this.sendMessage("muteRequest", content);
  }

  public sendStatus(feed: Feed, statusOptions?: any): void {
    let content: any = {
      source: feed.id,
      status: feed.getStatus(statusOptions)
    };

    this.sendMessage("statusUpdate", content);
  }

  public sendChatMessage(text: string): void {
    this.sendMessage("chatMsg", text);
  }

  private sendMessage(type: string, content: any): void {
    let text: string = JSON.stringify({
      type: type,
      content: content
    });

    let mainFeed: Feed = this.feedsService.findMain();

    if (mainFeed === null) { return; }

    if (!mainFeed.isDataOpen()) {
      console.log("Data channel not open yet. Skipping");
      return;
    }

    let connection: any = mainFeed.connection;
    connection.sendData({
      text: text,
      error: (reason) => {
        alert(reason);
      },
      success: () => {
        console.log("Data sent: " + type);
      }
    });
  }
}
