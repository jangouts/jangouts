(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl', ['$scope', 'blockUI', 'UserService', 'RoomService', 'DataChannelService', 'FeedsService', MainCtrl]);

  function MainCtrl($scope, blockUI, UserService, RoomService, DataChannelService, FeedsService) {
    $scope.data = {
      feeds: function() {
        return FeedsService.allFeeds();
      },
      chat: [],
      mainFeed: FeedsService.findMain(),
      isConsentDialogOpen: null,
      isScreenShared: false
    };

    $scope.enter = function () {
      UserService.currentUser().then(function (user) {
        RoomService.connect().then(function() {
          RoomService.enter(1234, user.username);
        });
      });
    };

    $scope.setMainFeed = function(feed) {
      console.debug(feed);
      $scope.data.mainFeed = feed;
    }

    $scope.publishScreen = function() {
      RoomService.publishScreen();
      $scope.data.isScreenShared = true;
    }

    $scope.unPublishScreen = function() {
      RoomService.unPublishScreen();
      $scope.data.isScreenShared = false;
    }

    /* FIXME: code smell. These signals should be removed. */
    $scope.$on('feeds.update', function(evt, feed) {
      $scope.$apply();
    });

    $scope.$on('feeds.delete', function(evt, feedId) {
      $scope.$apply();
    });

    $scope.$on('room.error', function(evt, error) {
      // FIXME: do something neat
      alert("Janus error: " + error);
    });

    $scope.$on('room.destroy', function(evt) {
      // FIXME: alert and redirect to some place
      alert("Janus room destroyed");
    });

    $scope.$on('chat.message', function(evt, message) {
      $scope.data.chat.push({
        feed: message.feed,
        text: message.content,
        timestamp: new Date()
      });
      $scope.$apply();
    });

    $scope.$on('chat.submit', function(evt, text) {
      $scope.data.chat.push({
        feed: window.publisherFeed,
        text: text,
        timestamp: new Date()
      });
      DataChannelService.sendMessage("chatMsg", text);
    });

    $scope.$on('user.unset', function(evt) {
      RoomService.leave();
    });

    $scope.$on('consentDialog.changed', function(evt, open) {
      if (open) {
        blockUI.start();
      } else if (!open) {
        blockUI.stop();
      }
    });

    $scope.enter();
  }
})();
