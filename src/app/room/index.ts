import { RoomService } from "./room.service";
import { LogService } from "./log.service";
import { DataChannelService } from "./data-channel.service";
import { ActionService } from "./action.service";
export {
  DataChannelService,
  LogService,
  ActionService,
  RoomService
};
export { Room } from "./room.model";
export { LogEntry } from "./logentry.model";
export const ROOM_PROVIDERS = [
  RoomService,
  DataChannelService,
  LogService,
  ActionService,
];



import { LeaveButtonComponent } from "./leave-button.component";
import { RoomComponent } from "./room.component";

export {
  LeaveButtonComponent,
  RoomComponent
};

export const ROOM_COMPONENTS = [
  LeaveButtonComponent,
  RoomComponent
];
