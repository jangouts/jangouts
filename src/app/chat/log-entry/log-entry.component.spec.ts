import {
	inject, addProviders
} from '@angular/core/testing';

import { LogEntryComponent } from "./log-entry.component";

describe("Component: LogEntry", () => {

  beforeEach(() => addProviders([
    {provide: LogEntryComponent, useClass: LogEntryComponent}
  ]));

  beforeEach(inject([ LogEntryComponent ], (logEntry) => {
    this.logEntry = logEntry;
  }));

  describe("ngOnInit", () => {
    it("should set given text", () => {

      this.logEntry.message = {
        text: function (): string { return "message text"; }
      };

      this.logEntry.ngOnInit();

      expect(this.logEntry.text).toEqual("message text");
    });

  });

});
