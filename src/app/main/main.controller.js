(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl', ['$scope', 'UsersService', 'RoomService', MainCtrl]);

  function MainCtrl($scope, UsersService, RoomService) {
    $scope.data = {
      feeds: {}
    }

    $scope.enter = function () {
      UsersService.currentUser().then(function (user) {
        RoomService.enter(1234, user.username);
      });
    }

    $scope.fistro = function () {
      RoomService.sendData("chatMsg", "Eres un fistro");
    }

    $scope.$on('stream.create', function(evt, feed) {
      $scope.data.feeds[feed.id] = feed;
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

    $scope.$on('room.exit', function(evt) {
      // FIXME: redirect to some place
      alert("Exit");
    });

    $scope.enter();
  }
})();
