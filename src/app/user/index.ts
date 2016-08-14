import { upgradeAdapter } from "../adapter";

import { SigninFormComponent } from "./signin-form.component";
export { UserService } from "./user.service";

export default angular.module("janusHangouts.userComponent", [])
  .directive("jhSigninForm", <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(SigninFormComponent));
