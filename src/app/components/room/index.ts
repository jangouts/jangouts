import { RoomService } from "./room.service";
import { LogService } from "./log.service";
import { LeaveButtonComponent } from "./leave-button.component";
import { DataChannelService } from "./data-channel.service";
import { ActionService } from "./action.service";

import { upgradeAdapter } from "../../adapter";

export default angular.module("janusHangouts.roomComponent", [])
  .service("RoomService", upgradeAdapter.downgradeNg2Provider(RoomService))
  .service("LogService", upgradeAdapter.downgradeNg2Provider(LogService))
  .directive("jhLeaveButton", upgradeAdapter.downgradeNg2Component(LeaveButtonComponent))
  .service("DataChannelService", upgradeAdapter.downgradeNg2Provider(DataChannelService))
  .service("ActionService", upgradeAdapter.downgradeNg2Provider((ActionService));

export { Room } from "./room.model";
export { LogEntry } from "./logentry.model";
