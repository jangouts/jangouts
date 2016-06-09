import jhChatFormDirective from './jh-chat-form.directive';
import jhChatMessageDirective from './jh-chat-message.directive';
import jhChatDirective from './jh-chat.directive';
import jhLogEntryDirective from './jh-log-entry.directive';

export default angular.module('janusHangouts.chatComponent', [])
  .directive('jhChatForm', jhChatFormDirective)
  .directive('jhChatMessage', jhChatMessageDirective)
  .directive('jhChat', jhChatDirective)
  .directive('jhLogEntry', jhLogEntryDirective);
