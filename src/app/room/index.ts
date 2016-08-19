import { RoomService } from "./room.service";
import { LogService } from "./log.service";
import { DataChannelService } from "./data-channel.service";
import { ActionService } from "./action.service";
export { Room } from "./room.model";
export { LogEntry } from "./logentry.model";

import { LeaveButtonComponent } from "./leave-button.component";
import { RoomComponent } from "./room.component";

export {
  DataChannelService,
  LogService,
  ActionService,
  RoomService
};
export const ROOM_PROVIDERS = [
  RoomService,
  DataChannelService,
  LogService,
  ActionService,
];


export {
  LeaveButtonComponent,
  RoomComponent
};

export const ROOM_COMPONENTS = [
  LeaveButtonComponent,
  RoomComponent
];
