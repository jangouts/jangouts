import MuteNotifier from './mute-notifier.service';
import Notifier from './notifier.service';

export default angular.module('janusHangouts.notifierComponent', [])
  .service('MuteNotifier',  MuteNotifier)
  .service('Notifier',  Notifier);
