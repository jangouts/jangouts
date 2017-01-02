/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Component, OnInit } from "@angular/core";
import { Router, Event, NavigationStart, NavigationError } from "@angular/router";
import { Http, Response } from "@angular/http";

import { ConfigService } from "./config.provider";
import { SigninFormComponent } from "./user";
import { RoomComponent, RoomService } from "./room";
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
  entryComponents: [
    SigninFormComponent,
    RoomComponent,
    FooterComponent
  ]
})
export class AppComponent implements OnInit {

  constructor(private config: ConfigService,
              private roomService: RoomService,
              private http: Http,
              private router: Router) {}

  public ngOnInit(): void {
    this.getConfig();
    this.setRouterEvents();
  }

  private setRouterEvents(): void {
    this.router.events.subscribe((event: Event): void => {
      if (event instanceof NavigationStart) {
        this.roomService.leave(); // before changing state, cleanup feeds
      } else if (event instanceof NavigationError) {
        this.router.navigate(["/sign_in"]);
      }
    });
  }

  private getConfig(): void {
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
