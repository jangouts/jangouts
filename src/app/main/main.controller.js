(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl', ['$scope', '$timeout', 'RoomService', MainCtrl]);

  function MainCtrl($scope, $timeout, RoomService) {
    $scope.data = {
      feeds: {}
    }

    $scope.enter = function () {
      RoomService.enter(1234, 'trololo');
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
  }
})();
