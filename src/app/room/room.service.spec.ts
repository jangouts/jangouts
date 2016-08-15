import {
  beforeEach,
  describe,
  fakeAsync,
  tick,
  flushMicrotasks,
  expect,
  it
} from "@angular/core/testing";

import { Room} from "./room.model";
import { RoomService } from "./room.service";

declare const jasmine: any;
declare const spyOn: any;
declare const window: any;


class MockDataChannelService {
  public sendChatMessage(text: string): void {}
  public sendStatus(text: any): void {}
}

class MockActionService {
  public enterRoom(id: number, user: string, connection: any): void {}
  public destroyFeed(feed: any): void {}
  public stopIgnoringFeed(id: number, connection: any): void {}
  public remoteJoin(id: number, display: any, connection: any): void {}
  public publishScreen(id: number, display: any, connection: any): void {}
}

class MockFeedsService {
  public add(feed: any, options: any): void {}
  public allFeeds(): any { }
  public find(): any { }
  public destroy(feedId: number): void {}
  public findMain(): any {}
  public waitFor(id: number): any {}
  public publisherFeeds(): any {}
}

class MockConfigService {
  public janusServer: Array<string> = ["server1", "server2"];
  public janusDebug: boolean = true;
  public joinUnmutedLimit: number = 10;
}

class MockScreenShareService {
  public setInProgress(val: boolean): void {}
}

class MockBroadcaster {
  public broadcast(ev: any, data: any): void {}
  public on(ev: any): void {}
}


describe("Service: RoomService", () => {

  beforeEach(() => {
    // create mock dependencies
    this.feedsService = new MockFeedsService();
    this.dataChannelService = new MockDataChannelService();
    this.actionService = new MockActionService();
    this.configService = new MockConfigService();
    this.screenShareService = new MockScreenShareService();
    this.broadcaster = new MockBroadcaster();

    // create instance of service
    this.roomService = new RoomService(
      this.configService,
      this.feedsService,
      this.dataChannelService,
      this.actionService,
      this.screenShareService,
      this.broadcaster
    );

    // create Janus mock
    window.Janus = jasmine.createSpy("Janus");
    window.Janus.init = (): void => { };
  });

  describe("on create", () => {
    it("should initialize server attribute", () => {
      expect(this.roomService.server).toBe(this.configService.janusServer);
    });
  });

  describe("#connect", () => {
    it("should create a new instance of Janus when connect", () => {
      this.roomService.connect();

      expect(window.Janus).toHaveBeenCalledWith(jasmine.objectContaining({
        server: ["server1", "server2"],
        success: jasmine.any(Function),
        error: jasmine.any(Function),
        destroyed: jasmine.any(Function)
      }));
    });

    it("should not create a new instance of Janus if connected before", () => {
      this.roomService.connect();
      window.Janus.calls.reset();
      this.roomService.connect();

      expect(window.Janus).not.toHaveBeenCalled();

    });

    it("should show confirm message if Janus connection fails", <any>fakeAsync((): void => {
      spyOn(window, "confirm").and.returnValue(true);
      spyOn(window.location, "reload"); // this prevnet error of full page reload
      window.Janus.and.callFake((config) => {
        config.error();
        return this;
      });
      this.roomService.connect();

      expect(window.confirm).toHaveBeenCalled();
    }));
  });

  describe("with connection success", () => {

    beforeEach(() => {
      let that: any = this;
      this.attach = jasmine.createSpy("janus.attach");

      window.Janus.and.callFake(function (config: any): any {
        config.success();
        this.attach = that.attach;
        return this;
      });

      this.pluginHandle = {
        getPlugin: jasmine.createSpy("pluginHandle.getPlugin"),
        getId: jasmine.createSpy("pluginHandle.getId"),
        send: jasmine.createSpy("pluginHandle.send"),
        createOffer: jasmine.createSpy("pluginHandle.createOffer"),
        detach: jasmine.createSpy("pluginHandle.detach")
      };
    });

    describe("#enter", () => {

      beforeEach(() => {
        spyOn(this.roomService, "subscribeToFeed");
        spyOn(this.dataChannelService, "sendStatus");
        spyOn(this.actionService, "enterRoom");
        spyOn(this.actionService, "destroyFeed");
      });

      it("should create new janus session when call enter", <any>fakeAsync((): void => {
        this.roomService.enter("username");

        flushMicrotasks(); // resolve promises

        expect(this.attach).toHaveBeenCalledWith(jasmine.objectContaining({
          plugin: "janus.plugin.videoroom",
          success: jasmine.any(Function),
          error: jasmine.any(Function),
          ondataopen: jasmine.any(Function),
          onlocalstream: jasmine.any(Function),
          oncleanup: jasmine.any(Function),
          onmessage: jasmine.any(Function)
        }));
      }));

      it("should broadcast status information when Janus calls ondataopen callback", <any>fakeAsync((): void => {
        this.roomService.enter("username");
        this.roomService.setRoom({id: 1});
        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          config.ondataopen();
        });
        let feed: any = {id: 1};
        spyOn(this.feedsService, "publisherFeeds").and.returnValue([feed]);

        flushMicrotasks(); // resolve promises

        expect(this.dataChannelService.sendStatus).toHaveBeenCalledWith(
          feed,
          jasmine.objectContaining({exclude: "picture"})
        );
        tick(4000);
        flushMicrotasks();
        expect(this.dataChannelService.sendStatus).toHaveBeenCalledWith(feed);
      }));

      it("should set stream on mainFed when Janus calls onlocalstream callback", <any>fakeAsync((): void => {
        this.roomService.enter("username");
        this.roomService.setRoom({id: 1});
        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          config.onlocalstream("stream");
        });
        let feed: any = {
          setStream: jasmine.createSpy("feed.setStream")
        };
        spyOn(this.feedsService, "findMain").and.returnValue(feed);

        flushMicrotasks(); // resolve promises

        expect(feed.setStream).toHaveBeenCalledWith("stream");
      }));

      it("should attach to existing feeds when Janus confirm we joined", <any>fakeAsync((): void => {
        this.roomService.enter("username");
        this.roomService.setRoom({id: 1});
        let publishers: any[] = [
          {id: 1, display: "demo", waitingForConnection: function (): any { return true; }},
          {id: 2, display: "demo", waitingForConnection: function (): any { return true; }},
        ];
        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          config.onmessage({
            id: 1,
            room: "demo",
            videoroom: "joined",
            publishers: publishers
          });
        });
        spyOn(this.feedsService, "find").and.callFake((id) => {
          return publishers[id - 1];
        });

        flushMicrotasks(); // resolve promises

        expect(this.actionService.enterRoom).toHaveBeenCalled();
        for (let p of publishers) {
          expect(this.roomService.subscribeToFeed).toHaveBeenCalledWith(p.id, p.display);
        }
      }));

      it("should subscribe to feed when new feed attach", <any>fakeAsync((): void => {
        this.roomService.enter("username");
        this.roomService.setRoom({id: 1});

        let publishers: any[] = [
          {id: 1, display: "demo", waitingForConnection: function (): any { return true; }},
          {id: 2, display: "demo", waitingForConnection: function (): any { return true; }},
        ];
        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          config.onmessage({
            id: 1,
            room: "demo",
            videoroom: "event",
            publishers: publishers
          });
        });

        spyOn(this.feedsService, "find").and.callFake((id) => {
          return publishers[id - 1];
        });

        flushMicrotasks(); // resolve promises

        for (let p of publishers) {
          expect(this.roomService.subscribeToFeed).toHaveBeenCalledWith(p.id, p.display);
        }
      }));

      it("should destroy a feed leaving", <any>fakeAsync((): void => {
        this.roomService.enter("username");
        this.roomService.setRoom({id: 1});

        let leaving: any = {id: 1};
        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          config.onmessage({
            id: 1,
            room: "demo",
            videoroom: "event",
            leaving: leaving
          });
        });

        flushMicrotasks(); // resolve promises

        expect(this.actionService.destroyFeed).toHaveBeenCalledWith(leaving);
      }));

      it("should destroy a feed unpublished", <any>fakeAsync((): void => {
        this.roomService.enter("username");
        this.roomService.setRoom({id: 1});

        let unpublished: any = {id: 1};
        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          config.onmessage({
            id: 1,
            room: "demo",
            videoroom: "event",
            unpublished: unpublished
          });
        });

        flushMicrotasks(); // resolve promises

        expect(this.actionService.destroyFeed).toHaveBeenCalledWith(unpublished);

      }));

    });

    describe("#getRooms", () => {
      it("should return a list of rooms", <any>fakeAsync((): void => {
        let result: Promise<any> = this.roomService.getRooms("username");
        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
        });

        let rooms: any = [ {id: 1}, {id: 2} ];

        this.pluginHandle.send.and.callFake((config) => {
          config.success({
            videoroom: "success",
            list: rooms
          });
        });

        flushMicrotasks(); // resolve promises

        result.then((response) => {
          for (let room of response) {
            expect(room instanceof Room).toBe(true);
          }
        });
      }));
    });

    describe("#subscribeToFeed", () => {
      beforeEach(() => {
        this.roomService.enter("username");
        this.roomService.setRoom({id: 1});
      });

      it("should create new janus session", <any>fakeAsync((): void => {
        let feed: any = { id: 1 };
        spyOn(this.feedsService, "find").and.returnValue(feed);
        this.roomService.subscribeToFeed(1);

        flushMicrotasks(); // resolve promises

        expect(this.attach).toHaveBeenCalledWith(jasmine.objectContaining({
          plugin: "janus.plugin.videoroom",
          success: jasmine.any(Function),
          error: jasmine.any(Function),
          onmessage: jasmine.any(Function),
          onremotestream: jasmine.any(Function),
          ondataopen: jasmine.any(Function),
          ondata: jasmine.any(Function),
          oncleanup: jasmine.any(Function)
        }));
      }));

      it("should stop ignoring feed on attached", <any>fakeAsync((): void => {
        let feed: any = { id: 1 };
        spyOn(this.actionService, "stopIgnoringFeed");
        spyOn(this.feedsService, "find").and.returnValue(feed);

        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          config.onmessage({
            videoroom: "attached"
          });
        });

        this.roomService.subscribeToFeed(1);

        flushMicrotasks(); // resolve promises

        expect(this.actionService.stopIgnoringFeed).toHaveBeenCalled();

      }));

      it("should join to feed if previuosly not joined", <any>fakeAsync((): void => {
        spyOn(this.actionService, "remoteJoin");

        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          config.onmessage({
            videoroom: "attached"
          });
        });

        this.roomService.subscribeToFeed(1);

        flushMicrotasks(); // resolve promises

        expect(this.actionService.remoteJoin).toHaveBeenCalled();

      }));

      it("should set new stream for feed", <any>fakeAsync((): void => {
        let feed: any = {id: 1, setStream: null};
        spyOn(feed, "setStream");
        spyOn(this.feedsService, "waitFor").and.callFake(() => {
          let promise: Promise<any> = new Promise<any>((resolve, reject) => {
            resolve(feed);
          });
          return promise;
        });

        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          if (config.onremotestream) {
            config.onremotestream({
              stream: "stream"
            });
          }
        });

        this.roomService.subscribeToFeed(1);

        flushMicrotasks(); // resolve promises

        expect(feed.setStream).toHaveBeenCalledWith(jasmine.objectContaining({stream: "stream"}));

      }));
    });

    describe("#publishScreen", () => {
      beforeEach(() => {
        this.roomService.enter("username");
        this.roomService.setRoom({id: 1});
      });

      it("should create new janus session", <any>fakeAsync((): void => {
        let feed: any = { id: 1, display: "display"};
        spyOn(this.feedsService, "findMain").and.returnValue(feed);
        this.roomService.publishScreen();

        flushMicrotasks(); // resolve promises

        expect(this.attach).toHaveBeenCalledWith(jasmine.objectContaining({
          plugin: "janus.plugin.videoroom",
          success: jasmine.any(Function),
          error: jasmine.any(Function),
          onmessage: jasmine.any(Function),
          onlocalstream: jasmine.any(Function)
        }));
      }));

      it("should set strem to main feed on local stream", <any>fakeAsync((): void => {
        let feed: any = { id: 1, setStream: null};
        spyOn(this.screenShareService, "setInProgress");
        spyOn(feed, "setStream");
        spyOn(this.feedsService, "find").and.returnValue(feed);
        spyOn(this.feedsService, "findMain").and.returnValue(feed);

        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          if (config.onlocalstream) {
            config.onlocalstream("stream");
          }
        });

        this.roomService.publishScreen();
        flushMicrotasks();

        expect(this.screenShareService.setInProgress).toHaveBeenCalledWith(true);
        expect(feed.setStream).toHaveBeenCalledWith("stream");
      }));

      it("should publish screen on joined", <any>fakeAsync((): void => {
        let feed: any = { id: 1, display: null };
        spyOn(this.actionService, "publishScreen");
        spyOn(this.screenShareService, "setInProgress");
        spyOn(this.feedsService, "findMain").and.returnValue(feed);

        this.attach.and.callFake((config) => {
          config.success(this.pluginHandle);
          if (config.onmessage) {
            config.onmessage({
              videoroom: "joined"
            });
          }
        });

        this.roomService.publishScreen();
        flushMicrotasks();

        expect(this.actionService.publishScreen).toHaveBeenCalled();
      }));
    });

  });
});
