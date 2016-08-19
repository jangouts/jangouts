import { provideRouter, RouterConfig}   from "@angular/router";

import { SigninFormComponent } from "./user";
import { RoomComponent } from "./room";
import { FooterComponent } from "./footer";

const appRoutes: RouterConfig = [
  {
    path: "sign_in",
    component: SigninFormComponent
  },
  //{
    //path: "rooms/:roomid",
    //component: RoomComponent
  //},
  { path: "", redirectTo: "/sign_in", pathMatch: "full" }
];

export const APP_ROUTER_PROVIDERS = provideRouter(appRoutes);
