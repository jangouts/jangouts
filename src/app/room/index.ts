import { upgradeAdapter } from "../adapter";

import { RoomService } from "./room.service";
import { LogService } from "./log.service";
import { DataChannelService } from "./data-channel.service";
import { ActionService } from "./action.service";
import { Room } from "./room.model";
import { LogEntry } from "./logentry.model";

upgradeAdapter.addProvider(DataChannelService);
upgradeAdapter.addProvider(LogService);
upgradeAdapter.addProvider(ActionService);
upgradeAdapter.addProvider(RoomService);

upgradeAdapter.upgradeNg1Provider("blockUI");
upgradeAdapter.upgradeNg1Provider("$state");
upgradeAdapter.upgradeNg1Provider("$scope");

import { LeaveButtonComponent } from "./leave-button.component";
import { RoomComponent } from "./room.component";

export default angular.module("janusHangouts.roomComponent", [])
  .service("RoomService", upgradeAdapter.downgradeNg2Provider(RoomService))
  .directive("jhRoom", <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(RoomComponent));

export {
  LogService,
  DataChannelService,
  ActionService,
  Room,
  LogEntry,
  RoomService,
  LeaveButtonComponent
};
