/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Injectable } from "@angular/core";
import {
  Routes,
  RouterModule,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
}   from "@angular/router";

import { SigninFormComponent } from "./user";
import { RoomComponent } from "./room";
import { StatesService } from "./router";

@Injectable()
export class UserRoomResolver {
  constructor(private states: StatesService) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Promise<any> {
    return this.states.setRoomAndUser({
      user: route.queryParams['user'],
      room: route.params['roomid'] || route.queryParams['room']
    });
  }
}


const appRoutes: Routes = [
  {
    path: "sign_in",
    component: SigninFormComponent,
    resolve: {
      state: UserRoomResolver
    }
  },
  {
    path: "rooms/:roomid",
    component: RoomComponent,
    resolve: {
      state: UserRoomResolver
    }
  },
  { path: "", redirectTo: "/sign_in", pathMatch: "full" }
];

export const appRoutingProviders: any[] = [
  UserRoomResolver,
  StatesService
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
