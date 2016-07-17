import {
  beforeEach,
  describe,
  expect,
  it
} from "@angular/core/testing";

import { FeedsService, Feed } from "../feed";

import { LogService } from "./log.service";
import { LogEntry } from "./logentry.model";
import { DataChannelService } from "./data-channel.service";

declare const jasmine: any;
declare const spyOn: any;

class MockLogService {
  public add(entry: LogEntry): void {}
}
class MockFeedsService {
  public find(): any { }
  public findMain(): any { }
}

describe("Service: DataChannelService", () => {

  beforeEach(() => {
    this.feedsService = new MockFeedsService();
    this.logService = new MockLogService();

    this.dataChannelService = new DataChannelService(
      this.feedsService,
      this.logService
    );
  });

  describe("reveiceMessage", () => {
    it("should create a new chat logEntry when receive chat message", () => {
      let data: string = JSON.stringify({
        type: "chatMsg",
        content: "text example"
      });
      let feed: any = {id: 1};
      spyOn(this.feedsService, "find").and.returnValue(feed);
      spyOn(this.logService, "add");

      this.dataChannelService.receiveMessage(data, 1);

      expect(this.logService.add).toHaveBeenCalledWith(jasmine.objectContaining({
        t: "chatMsg",
        content: {
          feed: { id: 1},
          text: "text example"
        }
      }));
    });

    it("should create a new muteRequest logEntry when receive mute request", () => {
      let data: string = JSON.stringify({
        type: "muteRequest",
        content: {
          target: 1
        }
      });
      let feed: any = {id: 1};
      spyOn(this.feedsService, "find").and.returnValue(feed);
      spyOn(this.logService, "add");

      this.dataChannelService.receiveMessage(data, 1);

      expect(this.logService.add).toHaveBeenCalledWith(jasmine.objectContaining({
        t: "muteRequest",
        content: {
          source: { id: 1},
          target: { id: 1}
        }
      }));
    });

    it("should mute the target feed if is publisher when receive mute request", () => {
      let data: string = JSON.stringify({
        type: "muteRequest",
        content: {
          target: 1
        }
      });
      let feed: any = {
        id: 1,
        isPublisher: true,
        setEnabledChannel: (): void => { }
      };
      spyOn(this.feedsService, "find").and.returnValue(feed);
      spyOn(feed, "setEnabledChannel");

      this.dataChannelService.receiveMessage(data, 1);

      expect(feed.setEnabledChannel).toHaveBeenCalledWith("audio", false, jasmine.any(Object))
    });

    it("should update the feed status when receive statusUpdate", () => {
      let data: string = JSON.stringify({
        type: "statusUpdate",
        content: {
          source: 1,
          status: "new status"
        }
      });
      let feed: any = {
        id: 1,
        setStatus: (s: string): void => { }
      };
      spyOn(this.feedsService, "find").and.returnValue(feed);
      spyOn(feed, "setStatus");

      this.dataChannelService.receiveMessage(data, 1);

      expect(feed.setStatus).toHaveBeenCalledWith("new status");
    });
  });

  describe("send functions", () => {
    let feed: any;

    beforeEach(() => {
      feed = {
        id: 1,
        isDataOpen: (): boolean => { return true; },
        getStatus: (): boolean => { return true; },
        connection: {
          sendData: (): void => {}
        }
      }
      spyOn(this.feedsService, "findMain").and.returnValue(feed);
      spyOn(feed.connection, "sendData")
    });

    it("should send message when send mute request", () => {
      this.dataChannelService.sendMuteRequest(feed);

      expect(feed.connection.sendData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: JSON.stringify({
            type: "muteRequest",
            content: {
              target: feed.id
            }
          })
        })
      );
    });

    it("should send message when sendStatus", () => {
      this.dataChannelService.sendStatus(feed);

      expect(feed.connection.sendData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: JSON.stringify({
            type: "statusUpdate",
            content: {
              source: feed.id,
              status: true
            }
          })
        })
      );
    });

    it("should send message when sendChatMessage", () => {
      this.dataChannelService.sendChatMessage("text demo");

      expect(feed.connection.sendData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: JSON.stringify({
            type: "chatMsg",
            content: "text demo"
          })
        })
      );
    });

  });

});
