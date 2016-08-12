import { upgradeAdapter } from "../adapter";

import { Broadcaster } from "./broadcaster.service";

upgradeAdapter.addProvider(Broadcaster);

export { Broadcaster };
