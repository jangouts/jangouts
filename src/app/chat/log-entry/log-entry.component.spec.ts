import {
  beforeEachProviders,
  inject,
  it
} from "@angular/core/testing";

import { LogEntryComponent } from "./log-entry.component";

describe("LogEntry", () => {

  beforeEachProviders(() => [
    LogEntryComponent,
  ]);

  describe("ngOnInit", () => {
    it("should set text with message.text()", inject([ LogEntryComponent ], (logEntry) => {

      logEntry.message = {
        text: function (): string { return "message text"; }
      };

      logEntry.ngOnInit();

      expect(logEntry.text).toEqual("message text");
    }));

  });

});
