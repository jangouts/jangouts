import { inject, TestBed } from "@angular/core/testing";
import { FooterComponent } from "./footer.component";

describe("Component: Footer", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FooterComponent]
    });
  });

  it("should have version defined", inject([ FooterComponent ], (footer) => {
    expect(footer.version).toBeDefined();
  }));

  it("should have the correct version", inject([ FooterComponent ], (footer) => {
    // TODO: this test is fragile and it will break when we bump the version.
    expect(footer.version).toEqual("0.4.4");
  }));
});
