//import { upgradeAdapter } from "../adapter";

export { ScreenShareButtonComponent } from "./screen-share-button.component";
export { ScreenShareHintComponent } from "./screen-share-hint.component";
import { ScreenShareService } from "./screen-share.service";

//upgradeAdapter.addProvider(ScreenShareService);

//export default angular.module("janusHangouts.screenShareComponent", [])
  //.service("ScreenShareService",  upgradeAdapter.downgradeNg2Provider(ScreenShareService));

export { ScreenShareService };
export const SCREEN_SHARE_PROVIDERS = [
  ScreenShareService
];
