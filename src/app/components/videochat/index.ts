import jhThumbnailsModeButtonDirective from './jh-thumbnails-mode-button.directive';
import jhVideoChatDirective from './jh-video-chat.directive';

export default angular.module('janusHangouts.videochatComponent', [])
  .directive('jhThumbnailsModeButton', jhThumbnailsModeButtonDirective)
  .directive('jhVideoChat', jhVideoChatDirective);
