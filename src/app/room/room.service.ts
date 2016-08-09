/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

import { Injectable } from "@angular/core";

import { Feed, FeedsService, FeedConnection } from "../feed";
import { ScreenShareService } from "../components/screen-share";
import { Config } from "../config.provider";
import { DataChannelService } from "./data-channel.service";
import { ActionService } from "./action.service";
import { Room } from "./room.model";

/*
 * Service to communication with janus room
 */
@Injectable()
export class RoomService {

  public room: Room = null;
  public rooms: any = null;
  public janus: any = null;
  public startMuted: boolean = false;
  public holdingKey: boolean = false;
  public muteTimer: any = null;

  private server: Array<string>;

  constructor(private feeds: FeedsService,
              private dataChannel: DataChannelService,
              private actionService: ActionService,
              private config: Config,
              private screenShareService: ScreenShareService) {

    this.server = this.config.janusServer;

  }

  public connect(): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {

      if (this.janus === null) {
        Janus.init({debug: this.config.janusDebug});

        this.janus = new Janus({
          server: this.server,
          success: () => { resolve(); },
          error: (error) => {
            let msg: string = `Janus error: ${error}`;
            msg += "\nDo you want to reload in order to retry?";
            reject();
            if (window.confirm(msg)) {
              window.location.reload();
            }
          },
          destroyed: () => { console.log("Janus object destroyed"); }
        });
      } else {
        resolve();
      }

    });

    return promise;
  }

  public doEnter(username: string): void {
    let connection: any = undefined;
    /*
     * Create new session
     */
    this.janus.attach({
      plugin: "janus.plugin.videoroom",
      success: (pluginHandle: any): void => {
        /*
         * Step 1. Right after attaching to the plugin, we send a
         * request to join
         */
        connection = new FeedConnection();
        connection.setAttrs(pluginHandle, this.room.id, "main");
        connection.register(username);
      },
      error: (error: string): void => {
        console.error(`Error attaching plugin... ${error}`);
      },
      // consentDialog: (on: boolean): void => {
        // console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
        // [TODO] - Reenable broadcast
        // $$rootScope.$broadcast('consentDialog.changed', on);
        // if(!on){
          // //notify if joined muted
          // if (startMuted) {
            // $$rootScope.$broadcast('muted.Join');
          // }
        // }
      // },
      ondataopen: (): void => {
        console.log("The publisher DataChannel is available");
        connection.onDataOpen();
        this.sendStatus();
      },
      onlocalstream: (stream: any): void => {
        /*
         * Step 4b (parallel with 4a).
         * Send the created stream to the UI, so it can be attached to
         * some element of the local DOM
         * console.log(" ::: Got a local stream :::");
         */
        let feed: Feed = this.feeds.findMain();
        feed.setStream(stream);
      },
      oncleanup: (): void => {
        console.log(" ::: Got a cleanup notification: we are unpublished now :::");
      },
      onmessage: (msg: any, jsep: any): void => {
        let event: any = msg.videoroom;
        console.log("Event: " + event);

        /*
         * Step 2. Response from janus confirming we joined
         */
        if (event === "joined") {
          console.log("Successfully joined room " + msg.room);
          this.actionService.enterRoom(msg.id, username, connection);
          /*
           * Step 3. Establish WebRTC connection with the Janus server
           * Step 4a (parallel with 4b). Publish our feed on server
           */

          if (this.config.joinUnmutedLimit !== undefined && this.config.joinUnmutedLimit !== null) {
            this.startMuted = (msg.publishers instanceof Array) && msg.publishers.length >= this.config.joinUnmutedLimit;
          }

          connection.publish({
            muted: this.startMuted,
            error: (): void => {
              connection.publish({
                noCamera: true,
                muted: this.startMuted
              }); }
          });

          /*
           * step 5. attach to existing feeds, if any
           */
          if ((msg.publishers instanceof Array) && msg.publishers.length > 0) {
            this.subscribeToFeeds(msg.publishers);
          }

          /*
           * The room has been destroyed
           */
        } else if (event === "destroyed") {
          console.log("The room has been destroyed!");
          // [TODO] - Reenable Broadcast
          // $$rootScope.$broadcast('room.destroy');

        } else if (event === "event") {
          /*
           * Any new feed to attach to?
           */
          if ((msg.publishers instanceof Array) && msg.publishers.length > 0) {
            this.subscribeToFeeds(msg.publishers);
          /*
           * One of the publishers has gone away?
           */
          } else if (msg.leaving !== undefined && msg.leaving !== null) {
            this.actionService.destroyFeed(msg.leaving);
          /*
           * One of the publishers has unpublished?
           */
          } else if ( msg.unpublished !== undefined && msg.unpublished !== null) {
            this.actionService.destroyFeed(msg.unpublished);
          /*
           * Reply to a configure request
           */
          } else if (msg.configured) {
            connection.confirmConfig();
          /*
           * The server reported an error
           */
          } else if (msg.error !== undefined && msg.error !== null) {
            console.error("Error message from server" + msg.error);
            // [TODO] - Reenable broadcast
            // $$rootScope.$broadcast('room.error', msg.error);
          }
        }

        if (jsep !== undefined && jsep !== null) {
          connection.handleRemoteJsep(jsep);
        }
      }
    });
  }

  public doGetRooms(): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      /*
       * Create a new session just to get the list
       */
      this.janus.attach({
        plugin: "janus.plugin.videoroom",
        success: (pluginHandle: any) => {
          console.log("getAvailableRooms plugin attached (" + pluginHandle.getPlugin() + ", id=" + pluginHandle.getId() + ")");

          let request: any = { "request": "list" };
          pluginHandle.send({
            message: request,
            success: (result: any) => {
              /*
               * Free the resource (it looks safe to do it here)
               */
              pluginHandle.detach();

              if (result.videoroom === "success") {
                let rooms: Array<Room> = _.map(result.list, (r) => {
                  return new Room(r);
                });
                rooms = _.sortBy(rooms, "label");
                resolve(rooms);
              } else {
                reject();
              }
            }
          });
        }
      });
    });

    return promise;
  }

  public enter(username: string): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.connect().then(() => {
        this.doEnter(username);
        resolve();
      });
    });
    return promise;
  }

  public leave(): void {
    this.actionService.leaveRoom();
  }

  public setRoom(room: Room): void {
    this.room = room;
  }

  public getRoom(): Room {
    return this.room;
  }

  public getRooms(): Promise<any> {
    let promise: Promise<any> = new Promise<any>((resolve, reject) => {
      if (this.rooms === null) {
        this.connect().then((): void => {
          this.doGetRooms().then((rooms: Array<Room>): void => {
            this.rooms = rooms;
            resolve(rooms);
          });
        });
      } else {
        resolve(this.rooms);
      }
    });

    return promise;
  }

  public subscribeToFeeds(list: Array<Feed>): void {
    console.log("Got a list of available publishers/feeds:");
    console.log(list);

    for (let f: number = 0; f < list.length; f++) {
      let id: number = list[f].id;
      let display: any = list[f].display;
      console.log("  >> [" + id + "] " + display);

      let feed: Feed = this.feeds.find(id);
      if (feed === null || feed.waitingForConnection()) {
        this.subscribeToFeed(id, display);
      }
    }
  }

  public subscribeToFeed(id: number, display?: any): void {
    let feed: Feed = this.feeds.find(id);
    let connection: any = undefined;

    if (feed) {
      display = feed.display;
    }

    this.janus.attach({
      plugin: "janus.plugin.videoroom",
      success: (pluginHandle: any): void => {
        connection = new FeedConnection();
        connection.setAttrs(pluginHandle, this.room.id, "subscriber");
        connection.listen(id);
      },
      error: (error: any): void => {
        console.error(`  -- Error attaching plugin... ${error}`);
      },
      onmessage: (msg: any, jsep: any): void => {
        console.log(" ::: Got a message (listener) :::");
        console.log(JSON.stringify(msg));

        let event: any = msg.videoroom;
        console.log("Event: " + event);

        if (event === "attached") {
          /*
           * Subscriber created and attached
           */
          if (feed) {
            this.actionService.stopIgnoringFeed(id, connection);
          } else {
            this.actionService.remoteJoin(id, display, connection);
          }
          console.log("Successfully attached to feed " + id + " (" + display + ") in room " + msg.room);

        } else if (msg.configured) {
          connection.confirmConfig();

        } else if (msg.started) {
          /*
           * Initial setConfig, needed to complete all the initializations
           */
          connection.setConfig({values: {audio: true, video: this.config.videoThumbnails}});

        } else {
          console.log("What has just happened?!");
        }

        if (jsep !== undefined && jsep !== null) {
          connection.subscribe(jsep);
        }
      },
      onremotestream: (stream: any): void => {
        this.feeds.waitFor(id).then((f: Feed): void => {
          f.setStream(stream);
        }, (reason: any): void => {
          console.error(reason);
        });
      },
      ondataopen: (): void => {
        console.log("The subscriber DataChannel is available");
        connection.onDataOpen();
        /*
         * Send status information of all our feeds to inform the newcommer
         */
        this.sendStatus();
      },
      ondata: (data: any): void => {
        console.log(" ::: Got info in the data channel (subscriber) :::");
        this.dataChannel.receiveMessage(data, id);
      },
      oncleanup: (): void => {
        console.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
      }
    });
  }

  public publishScreen(): void {
    let display: any = this.feeds.findMain().display;
    let connection: any = undefined;
    let id: number;

    this.janus.attach({
      plugin: "janus.plugin.videoroom",
      success: (pluginHandle: any): void => {
        connection = new FeedConnection();
        connection.setAttrs(pluginHandle, this.room.id, "screen");
        connection.register(display);
        this.screenShareService.setInProgress(true);
      },
      error: (error: any): void => {
        console.error("  -- Error attaching screen plugin... " + error);
      },
      onlocalstream: (stream: any): void => {
        console.log(" ::: Got the screen stream :::");
        let feed: Feed = this.feeds.find(id);
        feed.setStream(stream);
      },
      onmessage: (msg: any, jsep: any): void => {
        console.log(" ::: Got a message (screen) :::");
        console.log(msg);
        let event: any = msg.videoroom;

        if (event === "joined") {
          id = msg.id;
          this.actionService.publishScreen(id, display, connection);

          connection.publish({
            success: (): void => {
              this.screenShareService.setInProgress(false);
            },
            error: (error: any): void => {
              console.log(error);
              this.unPublishFeed(id);
              this.screenShareService.setInProgress(false);

              // [TODO] - Reenable when $modal upgraded
              console.log("Show ScreenShareService.showHelp()");
              // this.screenShareService.showHelp();
            }
          });
        /*
         * Reply to a configure request
         */
        } else if (msg.configured) {
          connection.confirmConfig();

        } else {
          console.log("Unexpected event for screen");
        }
        if (jsep !== undefined && jsep !== null) {
          connection.handleRemoteJsep(jsep);
        }
      }
    });
  }

  public unPublishFeed(feedId: number): void {
    this.actionService.destroyFeed(feedId);
  }

  public ignoreFeed(feedId: number): void {
    this.actionService.ignoreFeed(feedId);
  }

  public stopIgnoringFeed(feedId: number): void {
    this.subscribeToFeed(feedId);
  }

  public toggleChannel(type: string, feed?: Feed): void {
    this.actionService.toggleChannel(type, feed);
  }

  /**
   * Enable audio while holding key and disable audio when the key is released.
   */
  public pushToTalk(keyevent: any): void {
    let disableAudio: any = (): void => {
      this.actionService.setMedia("audio", false);
      this.holdingKey = false;
    };

    if (this.muteTimer) {
      clearTimeout(this.muteTimer);
    }
    // we need this so the user is muted when he focuses another window while holding the key
    this.muteTimer = setTimeout(disableAudio, 1000);


    if (keyevent === "keydown" && !this.holdingKey) {
      this.actionService.setMedia("audio", true);
      this.holdingKey = true;

    } else if (keyevent === "keyup") {
      this.actionService.setMedia("audio", false);
      this.holdingKey = false;
      clearTimeout(this.muteTimer);
    }
  }

  /**
   * Broadcast status information of all our feeds when a data channel is
   * established.
   *
   * To increase the chances of the info to be received, it sends the most
   * important information right away and the whole status some seconds after.
   * Hacky and dirty, we know.
   */
  private sendStatus(): void {
    this.feeds.publisherFeeds().forEach((p: Feed): void => {
      this.dataChannel.sendStatus(p, {exclude: "picture"});
      setTimeout((): void => {
        this.dataChannel.sendStatus(p);
      }, 4000);
    });
  }

}
