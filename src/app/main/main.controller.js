(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl', ['$scope', 'blockUI', 'UserService', 'RoomService', 'DataChannelService', 'FeedsService', 'LogService', MainCtrl]);

  function MainCtrl($scope, blockUI, UserService, RoomService, DataChannelService, FeedsService, LogService) {
    $scope.data = {
      feeds: function() {
        return FeedsService.allFeeds();
      },
      logEntries: function() {
        return LogService.allEntries();
      },
      highlightedByUser: null,
      highlighted: null,
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

    $scope.highlightedFeed = function () {
      if ($scope.data.highlightedByUser !== null) {
        $scope.data.highlighted = $scope.data.highlightedByUser;
      } else {
        $scope.data.highlighted = FeedsService.speakingFeed() || $scope.data.highlighted || FeedsService.findMain();
      }
      return $scope.data.highlighted;
    }

    $scope.toggleHighlightedFeed = function(feed) {
      console.log("Toggling feed");
      $scope.data.highlightedByUser = $scope.data.highlightedByUser ? null : feed;
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
