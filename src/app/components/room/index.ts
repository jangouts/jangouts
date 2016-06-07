import RoomService from './room.service';
import roomFactory from './rooms.factory';
import LogService from './log.service';
import LogEntryFactory from './log-entries.factory';
import jhLeaveButtonDirective from './jh-leave-button.directive';
import DataChannelService from './data-channel.service';
import ActionService from './action.service';

import { upgradeAdapter } from '../../adapter';

export default angular.module('janusHangouts.roomComponent', [])
  .service('RoomService', RoomService)
  .factory('Room', roomFactory)
  .service('LogService', LogService)
  .factory('LogEntry', LogEntryFactory)
  .directive('jhLeaveButton', jhLeaveButtonDirective)
  .service('DataChannelService', DataChannelService)
  .service('ActionService', ActionService);

upgradeAdapter.upgradeNg1Provider('ActionService');
