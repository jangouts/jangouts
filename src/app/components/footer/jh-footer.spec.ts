import {
  beforeEachProviders,
  inject,
  it
} from "@angular/core/testing";

import { FooterComponent } from "./jh-footer.directive";

describe("Footer", () => {
  beforeEachProviders(() => [
    FooterComponent
  ]);

  it("should have version defined", inject([ FooterComponent ], (footer) => {
    expect(footer.version).toBeDefined();
  }));

  it("should have version defined", inject([ FooterComponent ], (footer) => {
    expect(footer.version).toEqual("0.4.4");
  }));
});
