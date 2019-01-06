/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .factory('LogEntry', ['$sanitize', LogEntryFactory]);

  function LogEntryFactory($sanitize) {
    return function(type, content) {
      this.type = type;
      this.timestamp = new Date();
      this.content = content || {};

      this.text = function() {
        return this[this.type + "Text"]();
      };

      this.muteRequestText = function() {
        var res;

        if (this.content.source.isPublisher) {
          res = "You have muted ";
        } else {
          res = this.content.source.display + " has muted ";
        }
        if (this.content.target.isPublisher) {
          res += "you";
        } else {
          res += this.content.target.display;
        }
        return res;
      };

      this.chatMsgText = function() {
        return $sanitize(this.content.text).trim();
      };

      this.publishScreenText = function() {
        return "화면 공유를 시작합니다";
      };

      this.destroyFeedText = function() {
        if (this.content.feed.isLocalScreen) {
          return "화면 공유를 중지합니다";
        } else {
          return this.content.feed.display + "님이 방을 떠났습니다";
        }
      };

      this.newRemoteFeedText = function() {
        return this.content.feed.display + " 님이 방에 들어왔습니다";
      };

      this.ignoreFeedText = function() {
        return "You are ignoring " + this.content.feed.display + " now";
      };

      this.stopIgnoringFeedText = function() {
        return "You are not longer ignoring " + this.content.feed.display;
      };

      this.hasText = function() {
        return this.text() !== "";
      };
    };
  }
})();
