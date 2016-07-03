/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

import { Injectable } from "@angular/core";

import { Feed, FeedsService } from "../feed";
import { DataChannelService } from "./data-channel.service";
import { LogService } from "./log.service";
import { LogEntry } from "./logentry.model";

@Injectable()
export class ActionService {

  constructor(private feeds: FeedsService,
              private dataChannel: DataChannelService,
              private logService: LogService) { }

  public enterRoom(feedId: number, display: any, connection: any): void {
    let feed: Feed = new Feed();
    feed.setAttrs({
      display: display,
      connection: connection,
      id: feedId,
      isPublisher: true,
      dataChannel: this.dataChannel
    });
    this.feeds.add(feed, {main: true});
  }

  public leaveRoom(): void {
    _.forEach(this.feeds.allFeeds(), (feed) => {
      this.destroyFeed(feed.id);
    });
  }

  public publishScreen(feedId: number, display: any, connection: any): void {
    let feed: Feed = new Feed();
    feed.setAttrs({
      display: display,
      connection: connection,
      id: feedId,
      isPublisher: true,
      isLocalScreen: true,
      dataChannel: this.dataChannel
    });
    this.feeds.add(feed);

    this.log("publishScreen");
  }

  public remoteJoin(feedId: number, display: any, connection: any): void {
    let feed: Feed = new Feed();
    feed.setAttrs({
      display: display,
      connection: connection,
      id: feedId,
      isPublisher: false,
      dataChannel: this.dataChannel
    });
    this.feeds.add(feed);

    this.log("newRemoteFeed", {feed: feed});
  }

  public destroyFeed(feedId: number): void {
    let feed: Feed = this.feeds.find(feedId);
    if (feed === null) { return; }

    feed.disconnect();
    this.feeds.destroy(feedId);

    this.log("destroyFeed", {feed: feed});
  }

  public ignoreFeed(feedId: number): void {
    let feed: Feed = this.feeds.find(feedId);
    if (feed === null) { return; }
    feed.ignore();

    this.log("ignoreFeed", {feed: feed});
  }

  public stopIgnoringFeed(feedId: number, connection: any): void {
    let feed: Feed = this.feeds.find(feedId);
    if (feed === null) { return; }
    feed.stopIgnoring(connection);

    this.log("stopIgnoringFeed", {feed: feed});
  }

  public writeChatMessage(text: string): void {
    let entry: LogEntry = new LogEntry("chatMsg", {feed: this.feeds.findMain(), text: text});
    if (entry.hasText()) {
      this.logService.add(entry);
      this.dataChannel.sendChatMessage(text);
    }
  }

  public toggleChannel(type: string, feed: Feed): void {
    /*
     * If no feed is provided, we are muting ourselves
     */
    if (!feed) {
      feed = this.feeds.findMain();
      if (!feed) { return; }
    }

    if (!feed.isPublisher) {
      this.log("muteRequest", {source: this.feeds.findMain(), target: feed});
    }

    if (feed.isEnabled(type)) {
      let callback: any = null;
      /*
       * If we are muting the main feed (the only publisher that can be
       * actually muted) raise a signal
       */
      if (type === "audio" && feed.isPublisher) {
        callback = (): void => {
          // [TODO] - Set broadcast for 'muted.byUser'
          // $rootScope.$broadcast("muted.byUser");
        };
      }
      feed.setEnabledChannel(type, false, {after: callback});
    } else {
      feed.setEnabledChannel(type, true);
    }
  }

  /**
   * Disable or enable audio or video for the main feed
   */
  public setMedia(type: string, boolval: boolean): void {
    let feed: Feed = this.feeds.findMain();
    if (!feed) { return; }

    feed.setEnabledChannel(type, boolval);
  }

  private log(msg: string, extra?: any): void {
    let entry: LogEntry = new LogEntry(msg, extra);
    /*
     * Log the event
     */
    this.logService.add(entry);
  }

}
