(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl', ['$scope', 'UserService', 'RoomService', MainCtrl]);

  function MainCtrl($scope, UserService, RoomService) {
    $scope.data = {
      feeds: {},
      chat: [],
      mainFeed: {}
    };

    $scope.enter = function () {
      UserService.currentUser().then(function (user) {
        RoomService.enter(1234, user.username);
      });
    };

    $scope.setMainFeed = function(feed) {
      console.debug(feed);
      $scope.data.mainFeed = feed;
    }

    $scope.$on('stream.create', function(evt, feed) {
      $scope.data.feeds[feed.id] = feed;
      $scope.data.mainFeed = feed;
      $scope.$apply();
    });

    $scope.$on('feeds.add', function(evt, feed) {
      $scope.data.feeds[feed.id] = feed;
      $scope.$apply();
    });

    $scope.$on('feeds.update', function(evt, feed) {
      $scope.data.feeds[feed.id] = feed;
      $scope.$apply();
    });

    $scope.$on('feeds.delete', function(evt, feedId) {
      delete $scope.data.feeds[feedId];
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
        feed: $scope.data.feeds[0],
        text: text,
        timestamp: new Date()
      });
      $scope.$apply();
      RoomService.sendData("chatMsg", text);
    });

    $scope.enter();
  }
})();
