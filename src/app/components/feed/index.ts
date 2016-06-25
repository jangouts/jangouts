import { upgradeAdapter } from "../../adapter";

import { FeedsService, Feed, FeedConnection } from "./shared";

import { PushToTalkComponent } from "./pushtotalk";
import { MainFeedComponent } from "./main-feed";

import { FeedComponent } from "./feed.component";

upgradeAdapter.addProvider(FeedsService);
upgradeAdapter.addProvider(Feed);
upgradeAdapter.addProvider(FeedConnection);

upgradeAdapter.upgradeNg1Provider("hotkeys"); // needed for pushToTalk

export default angular.module("janusHangouts.feedComponent", [])
  .service("FeedsService", upgradeAdapter.downgradeNg2Provider(FeedsService))
  .factory("Feed", upgradeAdapter.downgradeNg2Provider(Feed))
  .factory("FeedConnection", upgradeAdapter.downgradeNg2Provider(FeedConnection))
  .directive("jhPushtotalkButton", <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(PushToTalkComponent))
  .directive("jhFeed", <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(FeedComponent))
  .directive("jhMainFeed", <angular.IDirectiveFactory>upgradeAdapter.downgradeNg2Component(MainFeedComponent))


export { FeedsService, Feed, FeedConnection }
