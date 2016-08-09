import { upgradeAdapter } from "../../adapter";

import jhScreenShareButtonDirective from './jh-screen-share-button.directive';
import jhScreenShareHintDirective from './jh-screen-share-hint.directive';
import ScreenShareHelpCtrl from './screen-share-help.controller';
import { ScreenShareService } from './screen-share.service';

upgradeAdapter.addProvider(ScreenShareService);

// upgradeAdapter.upgradeNg1Provider('$modal'); // need for ScreenShareService.showModal

export default angular.module('janusHangouts.screenShareComponent', [])
  .directive('jhScreenShareButton', jhScreenShareButtonDirective)
  .directive('jhScreenShareHint', jhScreenShareHintDirective)
  .controller('ScreenShareHelpCtrl', ScreenShareHelpCtrl)
  .service('ScreenShareService',  upgradeAdapter.downgradeNg2Provider(ScreenShareService));

export { ScreenShareService };

