import { upgradeAdapter } from "../adapter";

import { ChatComponent} from "./chat.component";

export default angular.module("janusHangouts.chatComponent", [
  "janusHangouts.roomComponent"
]).directive("jhChat",
             <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(ChatComponent));

export { ChatComponent }
