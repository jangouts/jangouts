import { upgradeAdapter } from "../adapter";

import { StatesService } from "./states.service";

upgradeAdapter.addProvider(StatesService);

export default angular.module("janusHangouts.routerComponent", [])
  .service("StatesService", upgradeAdapter.downgradeNg2Provider(StatesService));
