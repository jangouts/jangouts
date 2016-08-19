import { LogEntry } from "./logentry.model";
import { DataChannelService } from "./data-channel.service";

class MockLogService {
  public add(entry: LogEntry): void {}
}
class MockFeedsService {
  public find(): any { }
  public findMain(): any { }
}

class MockBroadcaster {
  public broadcast(ev: any, data: any): void {}
  public on(ev: any): void {}
}

describe("Service: DataChannelService", () => {

  beforeEach(() => {
    this.feedsService = new MockFeedsService();
    this.logService = new MockLogService();
    this.broadcaster = new MockBroadcaster();

    this.dataChannelService = new DataChannelService(
      this.feedsService,
      this.logService,
      this.broadcaster
    );
    this.feed = {
      id: 1,
      isPublisher: true,
      isDataOpen: jasmine.createSpy("feed.isDataOpen"),
      setStatus: jasmine.createSpy("feed.setStatus"),
      getStatus: jasmine.createSpy("feed.getStatus").and.returnValue(true),
      setEnabledChannel: jasmine.createSpy("feed.setEnabledChannel"),
      connection: jasmine.createSpyObj("connection", ["sendData"])
    };
    spyOn(this.feedsService, "findMain").and.returnValue(this.feed);
    spyOn(this.feedsService, "find").and.returnValue(this.feed);
    spyOn(this.logService, "add");
  });

  describe("#reveiceMessage", () => {
    it("should create a new chat logEntry when receive chat message", () => {
      let data: string = JSON.stringify({
        type: "chatMsg",
        content: "text example"
      });

      this.dataChannelService.receiveMessage(data, 1);

      expect(this.logService.add).toHaveBeenCalledWith(jasmine.objectContaining({
        t: "chatMsg",
        content: {
          feed: this.feed,
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

      this.dataChannelService.receiveMessage(data, 1);

      expect(this.logService.add).toHaveBeenCalledWith(jasmine.objectContaining({
        t: "muteRequest",
        content: {
          source: this.feed,
          target: this.feed
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

      this.dataChannelService.receiveMessage(data, 1);

      expect(this.feed.setEnabledChannel).toHaveBeenCalledWith("audio", false, jasmine.any(Object));
    });

    it("should update the feed status when receive statusUpdate", () => {
      let data: string = JSON.stringify({
        type: "statusUpdate",
        content: {
          source: 1,
          status: "new status"
        }
      });

      this.feed.isPublisher = false;

      this.dataChannelService.receiveMessage(data, 1);

      expect(this.feed.setStatus).toHaveBeenCalledWith("new status");
    });
  });

  describe("#sendMuteRequest", () => {
    it("should send mute request", () => {
      this.feed.isDataOpen.and.returnValue(true);

      this.dataChannelService.sendMuteRequest(this.feed);

      expect(this.feed.connection.sendData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: JSON.stringify({
            type: "muteRequest",
            content: {
              target: this.feed.id
            }
          })
        })
      );
    });
  });

  describe("#sendStatus", () => {
    it("should send message when sendStatus", () => {
      this.feed.isDataOpen.and.returnValue(true);

      this.dataChannelService.sendStatus(this.feed);

      expect(this.feed.connection.sendData).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: JSON.stringify({
            type: "statusUpdate",
            content: {
              source: this.feed.id,
              status: true
            }
          })
        })
      );
    });
  });

  describe("#sendChatMessage", () => {
    it("should send message when sendChatMessage", () => {
      this.feed.isDataOpen.and.returnValue(true);

      this.dataChannelService.sendChatMessage("text demo");

      expect(this.feed.connection.sendData).toHaveBeenCalledWith(
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
