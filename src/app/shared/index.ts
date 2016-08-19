//import { upgradeAdapter } from "../adapter";

import { Broadcaster } from "./broadcaster.service";

//upgradeAdapter.addProvider(Broadcaster);

export { Broadcaster };

export const SHARED_PROVIDERS = [
  Broadcaster
];
