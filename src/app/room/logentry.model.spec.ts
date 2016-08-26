import { LogEntry } from "./logentry.model";

describe("Model: LogEntry", () => {

  describe("#text", () => {
    it("should the correct method for defined type", () => {
      let logEntry: LogEntry = new LogEntry("muteRequest");
      spyOn(logEntry, "muteRequestText");
      logEntry.text();
      expect(logEntry.muteRequestText).toHaveBeenCalled();
    });
  });

  describe("#muteRequestText", () => {
    it("should return a message indicating you muted somebody when source is publisher", () => {
      let logEntry: LogEntry = new LogEntry("muteRequest", {
        source: { isPublisher: true },
        target: { isPublisher: true }
      });

      expect(logEntry.muteRequestText()).toEqual("You have muted you");

      logEntry = new LogEntry("muteRequest", {
        source: { isPublisher: true },
        target: { display: "ancor" }
      });

      expect(logEntry.muteRequestText()).toEqual("You have muted ancor");
    });

    it("should return a message indicating somebody muted somebody when source isn't publisher", () => {
      let logEntry: LogEntry = new LogEntry("muteRequest", {
        source: { display: "ancor" },
        target: { isPublisher: true }
      });

      expect(logEntry.muteRequestText()).toEqual("ancor has muted you");

      logEntry = new LogEntry("muteRequest", {
        source: { display: "ancor" },
        target: { display: "imo" }
      });

      expect(logEntry.muteRequestText()).toEqual("ancor has muted imo");
    });
  });

  describe("#chatMsgText", () => {
    it("should return content text", () => {
      let logEntry: LogEntry = new LogEntry("chatMsg", { text: "example text" });
      expect(logEntry.chatMsgText()).toEqual("example text");
    });
  });

  describe("#publishScreenText", () => {
    it("should return text indicating screen sharing started", () => {
      let logEntry: LogEntry = new LogEntry("publishScreen");
      expect(logEntry.publishScreenText()).toEqual("Screen sharing started");
    });
  });

  describe("#destroyFeedText", () => {
    it("should return text indicating screen sharing stopped", () => {
      let logEntry: LogEntry = new LogEntry("destroyFeed", {
        feed: { isLocalScreen: true }
      });
      expect(logEntry.destroyFeedText()).toEqual("Screen sharing stopped");
    });

    it("should return text indicating somebody left the room", () => {
      let logEntry: LogEntry = new LogEntry("destroyFeed", {
        feed: { display: "ancor" }
      });
      expect(logEntry.destroyFeedText()).toEqual("ancor has left the room");
    });
  });

  describe("#newRemoteFeedText", () => {
    it("should return a text indicating somebody joined the room", () => {
      let logEntry: LogEntry = new LogEntry("newRemoteFeed", {
        feed: { display: "ancor" }
      });
      expect(logEntry.newRemoteFeedText()).toEqual("ancor has joined the room");

    });
  });

  describe("#ignoreFeedText", () => {
    it("should return a text indicating somebody joined the room", () => {
      let logEntry: LogEntry = new LogEntry("ignoreFeed", {
        feed: { display: "ancor" }
      });
      expect(logEntry.ignoreFeedText()).toEqual("You are ignoring ancor now");
    });
  });

  describe("#stopIgnoringFeedText", () => {
    it("should return a text indicating somebody joined the room", () => {
      let logEntry: LogEntry = new LogEntry("stopIgnoringFeed", {
        feed: { display: "ancor" }
      });
      expect(logEntry.stopIgnoringFeedText()).toEqual("You are not longer ignoring ancor");
    });
  });

  describe("#hasText", () => {
    it("should be true if has text to show", () => {
      let logEntry: LogEntry = new LogEntry("chatMsg", { text: "example text" });
      expect(logEntry.hasText()).toBe(true);
    });

    it("should be false if has no text to show", () => {
      let logEntry: LogEntry = new LogEntry("chatMsg", { text: "" });
      expect(logEntry.hasText()).toBe(false);
    });
  });

});
