import { Routes, RouterModule }   from "@angular/router";

import { SigninFormComponent } from "./user";
import { RoomComponent } from "./room";

const appRoutes: Routes = [
  {
    path: "sign_in",
    component: SigninFormComponent
  },
  {
    path: "rooms/:roomid",
    component: RoomComponent
  },
  { path: "", redirectTo: "/sign_in", pathMatch: "full" }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
