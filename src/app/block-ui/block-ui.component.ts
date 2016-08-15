import { Component, OnInit } from "@angular/core";

import { Broadcaster } from "../shared";

@Component({
    selector: "jh-block-ui",
    template: require("./block-ui.component.html")
})
export class BlockUIComponent implements OnInit {

  public show: boolean = false;

  constructor(private broadcaster: Broadcaster) { }

  public ngOnInit(): void {
    this.broadcaster.on("consentDialog.changed").subscribe((open: boolean): void => {
      this.show = open;
    });
  }

}

