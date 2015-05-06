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

    $scope.enter = enter;
    $scope.publishScreen = publishScreen;
    $scope.unPublishScreen = unPublishScreen;

    $scope.enter();

    $scope.$on('room.error', function(evt, error) {
      // FIXME: do something neat
      alert("Janus error: " + error);
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

    function enter() {
      UserService.currentUser().then(function (user) {
        RoomService.enter(user.username);
      });
    }

    function publishScreen() {
      RoomService.publishScreen();
      $scope.data.isScreenShared = true;
    }

    function unPublishScreen() {
      RoomService.unPublishScreen();
      $scope.data.isScreenShared = false;
    }
  }
})();
