(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl',  MainCtrl);

  MainCtrl.$inject = ['$scope', 'blockUI', 'UserService', 'RoomService',
    'LogService'];

  function MainCtrl($scope, blockUI, UserService, RoomService, LogService) {
    $scope.data = {
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
        RoomService.enter(user.username);
      });
    };

    $scope.publishScreen = function() {
      RoomService.publishScreen();
      $scope.data.isScreenShared = true;
    };

    $scope.unPublishScreen = function() {
      RoomService.unPublishScreen();
      $scope.data.isScreenShared = false;
    };

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
