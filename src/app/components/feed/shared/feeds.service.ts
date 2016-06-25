/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

import { Injectable } from "@angular/core";
import { Feed } from "./feeds.factory";

/**
 * Feeds collection
 */
@Injectable()
export class FeedsService {

  private mainFeed: Feed = null;
  private feeds: any = {};

  constructor () { }


  /**
   * @param id  id of the feed to find
   * @returns   gets feed with given id or null if not found
   */
  public find(id: number): Feed {
    return (this.feeds[id] || null);
  }

  /**
   * @returns gets main feed or null if not found
   */
  public findMain(): Feed {
    return this.mainFeed;
  }

  /**
   * @param id        Feed's id
   * @param attempts  Max number of attempts
   * @param timeout   Time (in miliseconds) between attempts
   * @return          Promise to be resolved when te feed is found
   */
  public waitFor(id: number, attempts: number = 10, timeout: number = 1000): any {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      let feed: Feed = this.find(id);

      if (feed === null) { // if feed is not found, set an interval to check again
        let interval: any = setInterval(() => {
          feed = this.find(id);
          if (feed === null) { // the feed was not found this time
            attempts -= 1;
          } else { // the feed was finally found
            clearInterval(interval);
            resolve(feed);
          }
          if (attempts === 0) { // no more attempts left and feed was not found
            clearInterval(interval);
            reject(`feed with id ${id} was not found`);
          }
        }, timeout);
      } else {
        resolve(feed);
      }

    });
    return promise;
  }

  /**
   * Registers feed
   * @param feed    feed to register
   * @param options options with feed details
   */
  public add(feed: Feed, options?: any): void {
    this.feeds[feed.id] = feed;
    if (options && options.main) {
      this.mainFeed = feed;
    }
  }

	/**
   * Unregisters feed with given id.
   */
  public destroy(id: number): void {
  	delete this.feeds[id];
    if (this.mainFeed && (id === this.mainFeed.id)) {
    	this.mainFeed = null;
  	}
  }


  /**
   * @returns all registered feeds
   */
  public allFeeds(): Array<Feed> {
    return <Array<Feed>>_.values(this.feeds);
  }

  /**
   * @returns all registered publisher feeds
   */
  public publisherFeeds(): Array<Feed> {
    return <Array<Feed>>_.filter(this.allFeeds(), (f: Feed) => {
      return f.isPublisher;
    });
  }

  /**
   * @returns all registered feeds sharing local screen
   */
  public localScreenFeeds(): Array<Feed> {
    return <Array<Feed>>_.filter(this.allFeeds(), (f: Feed) => {
      return f.isLocalScreen;
    });
  }

  /**
   * @returns registered feed that speaks or null
   */
  public speakingFeed(): Feed {
    return <Feed>_.find(this.allFeeds(), (f: Feed) => {
      return f.getSpeaking();
    });
  }

}
