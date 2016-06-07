import jhChatDirective from './jh-chat.directive';
import jhLogEntryDirective from './jh-log-entry.directive';

import { upgradeAdapter } from '../../adapter';

import { ChatMessageComponent} from './jh-chat-message';
import { ChatFormComponent} from './jh-chat-form';

export default angular.module('janusHangouts.chatComponent', ['janusHangouts.roomComponent'])
  .directive('jhChat', jhChatDirective)
  .directive('jhLogEntry', jhLogEntryDirective)
  .directive('jhChatForm',
             <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(ChatFormComponent))
  .directive('jhChatMessage',
             <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(ChatMessageComponent));
