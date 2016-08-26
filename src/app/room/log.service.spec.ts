import { LogService } from "./log.service";
import { LogEntry } from "./logentry.model";

describe("Service: LogService", () => {

  beforeEach(() => {
    this.logService = new LogService();
  });

  it("should push new entry in entries list", () => {
    let l1: LogEntry = new LogEntry("msg1");
    let l2: LogEntry = new LogEntry("msg1");

    this.logService.add(l1);
    this.logService.add(l2);

    expect(this.logService.allEntries()).toEqual(
      jasmine.arrayContaining([l1, l2])
    );

  });

});
