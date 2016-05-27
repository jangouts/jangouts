import FeedsService from './feeds.service';
import feedFactory from './feeds.factory';
import feedConnectionFactory from './feed-connection.factory';
import connectionConfigFactory from './connection-config.factory';
import jhFeed from './jh-feed.directive';
import jhMainFeedDirective from './jh-main-feed.directive';
import jhPushToTalkButtonDirective from './jh-pushtotalk.directive';
import speakObserverFactory from './speak-observer.factory';
import jhAudioButton from './buttons/jh-audio-button.directive';
import jhIgnoreButton from './buttons/jh-ignore-button.directive';
import jhUnpublishButton from './buttons/jh-unpublish-button.directive';
import jhVideoButton from './buttons/jh-video-button.directive';

export default angular.module('janusHangouts.feedComponent', [])
  .service('FeedsService', FeedsService)
  .factory('Feed', feedFactory)
  .factory('FeedConnection', feedConnectionFactory)
  .factory('ConnectionConfig', connectionConfigFactory)
  .directive('jhFeed', jhFeed)
  .directive('jhMainFeed', jhMainFeedDirective)
  .directive('jhPushtotalkButton', jhPushToTalkButtonDirective)
  .factory('SpeakObserver', speakObserverFactory)
  .directive('jhAudioButton', jhAudioButton)
  .directive('jhIgnoreButton', jhIgnoreButton)
  .directive('jhUnpublishButton', jhUnpublishButton)
  .directive('jhVideoButton', jhVideoButton);
