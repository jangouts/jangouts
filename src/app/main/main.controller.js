(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl', ['$scope', '$timeout', 'RoomService', MainCtrl]);

  function MainCtrl($scope, $timeout, RoomService) {
    $scope.data = {
      feeds: [],
    }

    $scope.enter = function () {
      RoomService.enter(1234, 'trololo');
    }

    $scope.$on('stream.create', function(evt, stream) {
      $scope.data.feeds.push({ stream: stream, name: 'Testing'});
      $scope.$apply();
    });

  }
})();
