import { RoomService } from "./room.service";
import { LogService } from "./log.service";
import { DataChannelService } from "./data-channel.service";
import { ActionService } from "./action.service";
import { LeaveButtonComponent } from "./leave-button.component";
import { RoomComponent } from "./room.component";

import { upgradeAdapter } from "../adapter";

export default angular.module("janusHangouts.roomComponent", [])
  .service("RoomService", upgradeAdapter.downgradeNg2Provider(RoomService))
  .service("LogService", upgradeAdapter.downgradeNg2Provider(LogService))
  .directive("jhLeaveButton", upgradeAdapter.downgradeNg2Component(LeaveButtonComponent))
  .directive("jhRoom", upgradeAdapter.downgradeNg2Component(RoomComponent))
  .service("DataChannelService", upgradeAdapter.downgradeNg2Provider(DataChannelService))
  .service("ActionService", upgradeAdapter.downgradeNg2Provider(ActionService));

export { Room } from "./room.model";
export { LogEntry } from "./logentry.model";
