import { FeedsService, Feed, FeedConnection } from "./shared";

export { FeedsService, Feed, FeedConnection };
export const FEED_PROVIDERS: any[] = [ FeedsService, FeedConnection, Feed ];


import { PushToTalkComponent } from "./pushtotalk";
import { MainFeedComponent } from "./main-feed";
import { FeedComponent } from "./feed.component";

import {
  AudioButtonComponent,
  VideoButtonComponent,
  IgnoreButtonComponent,
  UnpublishButtonComponent,
  FEED_BUTTONS_COMPONENTS
} from "./buttons";

export {
  PushToTalkComponent,
  MainFeedComponent,
  FeedComponent,
  AudioButtonComponent,
  VideoButtonComponent,
  IgnoreButtonComponent,
  UnpublishButtonComponent,
  FEED_BUTTONS_COMPONENTS
};

export const FEED_COMPONENTS: any[] = [
  PushToTalkComponent,
  MainFeedComponent,
  FeedComponent,
  ...FEED_BUTTONS_COMPONENTS
];

import { VideoStreamDirective } from "./shared/videostream.directive";
import { SendPicsDirective } from "./send-pics.directive";
import { SetVideoSubscriptionDirective } from "./set-video-subscription.directive";

export const FEED_DIRECTIVES: any[] = [
  VideoStreamDirective,
  SendPicsDirective,
  SetVideoSubscriptionDirective
];
