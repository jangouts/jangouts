import { inject, addProviders } from "@angular/core/testing";

import { FooterComponent } from "./footer.component";

describe("Component: Footer", () => {
  beforeEach(() => addProviders([FooterComponent]));

  it("should have version defined", inject([ FooterComponent ], (footer) => {
    expect(footer.version).toBeDefined();
  }));

  it("should have the correct version", inject([ FooterComponent ], (footer) => {
    expect(footer.version).toEqual("0.4.4");
  }));
});
