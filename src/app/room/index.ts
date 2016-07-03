import { RoomService } from "./room.service";
import { LogService } from "./log.service";
import { DataChannelService } from "./data-channel.service";
import { ActionService } from "./action.service";
import { Room } from "./room.model";
import { LogEntry } from "./logentry.model";

import { LeaveButtonComponent } from "./leave-button.component";
import { RoomComponent } from "./room.component";

import { upgradeAdapter } from "../adapter";

export default angular.module("janusHangouts.roomComponent", [])
  .service("RoomService", upgradeAdapter.downgradeNg2Provider(RoomService))
  .service("LogService", upgradeAdapter.downgradeNg2Provider(LogService))
  .service("DataChannelService", upgradeAdapter.downgradeNg2Provider(DataChannelService))
  .service("ActionService", upgradeAdapter.downgradeNg2Provider(ActionService))
  .directive("jhLeaveButton", <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(LeaveButtonComponent))
  .directive("jhRoom", <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(RoomComponent));

upgradeAdapter.addProvider(DataChannelService);
upgradeAdapter.addProvider(RoomService);
upgradeAdapter.addProvider(LogService);
upgradeAdapter.addProvider(ActionService);

export {
  RoomService,
  LogService,
  DataChannelService,
  ActionService,
  Room,
  LogEntry
};
