import { Component } from "@angular/core";
import { ROUTER_DIRECTIVES } from "@angular/router";

import { ConfigService } from "./config.provider";
import { SigninFormComponent } from "./user";
import { RoomComponent } from "./room";
import { FooterComponent } from "./footer";

@Component({
  selector: "jh-jangouts",
  template: `
    <div class="container-fluid container-no-padding">
      <!-- Routed views go here -->
      <router-outlet></router-outlet>
    </div>

    <jh-footer></jh-footer>
  `,
  directives: [
    ROUTER_DIRECTIVES,
    SigninFormComponent,
    RoomComponent,
    FooterComponent
  ]
})
export class AppComponent {

  constructor(private config: ConfigService) {
    console.log("Contructor AppComponent");
    this.getConfig()
  }

  private getConfig(): void {
    let request: any = new XMLHttpRequest();
    request.open("GET", "config.json", false);
    request.send(null);
    if (request.status === 200) {
      let config: any = JSON.parse(request.responseText);
      for (let key in config) {
        if (config.hasOwnProperty(key)) {
          this.config[key] = config[key];
        }
      };
    } else {
      console.warn("No configuration found");
    }
  }
}
