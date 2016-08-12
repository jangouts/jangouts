import { FeedsService, Feed, FeedConnection } from "./shared";

import { upgradeAdapter } from "../adapter";
upgradeAdapter.addProvider(FeedsService);
upgradeAdapter.addProvider(Feed);
upgradeAdapter.addProvider(FeedConnection);

export { FeedsService, Feed, FeedConnection };
export { PushToTalkComponent } from "./pushtotalk";
export { MainFeedComponent } from "./main-feed";
export { FeedComponent } from "./feed.component";

