import { upgradeAdapter } from "../../adapter";

import { FeedsService } from "./feeds.service";
import { Feed } from "./feeds.factory";
import { FeedConnection } from "./feed-connection.factory";
import { PushToTalkComponent } from "./pushtotalk.component";

import jhFeed from "./jh-feed.directive";
import jhMainFeedDirective from "./jh-main-feed.directive";
//import jhPushToTalkButtonDirective from "./jh-pushtotalk.directive";
//import speakObserverFactory from "./speak-observer.factory";
import jhAudioButton from "./buttons/jh-audio-button.directive";
import jhIgnoreButton from "./buttons/jh-ignore-button.directive";
import jhUnpublishButton from "./buttons/jh-unpublish-button.directive";
import jhVideoButton from "./buttons/jh-video-button.directive";

upgradeAdapter.addProvider(FeedsService);
upgradeAdapter.addProvider(Feed);
upgradeAdapter.addProvider(FeedConnection);

upgradeAdapter.upgradeNg1Provider("hotkeys"); // needed for pushToTalk

export default angular.module("janusHangouts.feedComponent", [])
  .service("FeedsService", upgradeAdapter.downgradeNg2Provider(FeedsService))
  .factory("Feed", upgradeAdapter.downgradeNg2Provider(Feed))
  .factory("FeedConnection", upgradeAdapter.downgradeNg2Provider(FeedConnection))
  .directive("jhFeed", jhFeed)
  .directive("jhMainFeed", jhMainFeedDirective)
  .directive("jhPushtotalkButton", jhPushToTalkButtonDirective)
  .directive("jhAudioButton", jhAudioButton)
  .directive("jhIgnoreButton", jhIgnoreButton)
  .directive("jhUnpublishButton", jhUnpublishButton)
  .directive("jhVideoButton", jhVideoButton);

