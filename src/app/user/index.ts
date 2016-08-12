import { upgradeAdapter } from "../adapter";

import { SigninFormComponent } from "./signin-form.component";
import { UserService } from "./user.service";

upgradeAdapter.addProvider(UserService);

export default angular.module("janusHangouts.userComponent", [])
  .directive("jhSigninForm", <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(SigninFormComponent))
  .service("UserService",  upgradeAdapter.downgradeNg2Provider(UserService));
