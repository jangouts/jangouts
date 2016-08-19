import { Component, OnInit } from "@angular/core";
import { ROUTER_DIRECTIVES } from "@angular/router";
import { Http, Response } from '@angular/http';

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
export class AppComponent implements OnInit {

  constructor(private config: ConfigService,
              private http: Http) {}

  public ngOnInit(): void {
    this.http.get("config.json").subscribe((res: Response) => {
      if (res.status === 200) {
        let config: any = res.json();
        for (let key in config) {
          if (config.hasOwnProperty(key)) {
            this.config[key] = config[key];
          }
        };
      } else {
        console.warn("No configuration found");
      };

    });
  }
}
