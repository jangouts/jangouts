(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhSigninForm', ['$state', 'UserService', 'RoomService', jhSigninFormDirective]);

  function jhSigninFormDirective($state, UserService, RoomService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/user/jh-signin-form.html',
      scope: true,
      link: jhSigninFormLink,
      controllerAs: 'vm',
      bindToController: true,
      controller: JhSigninFormCtrl
    };

    function jhSigninFormLink(scope, element) {
      setTimeout(function() {
        $('#inputUsername', element).focus();
      }, 100);
    }

    function JhSigninFormCtrl() {
      /* jshint: validthis */
      var vm = this;
      vm.username = null;
      vm.room = null;
      vm.rooms = []
      vm.signin = signin;

      RoomService.connect().then(function() {
        RoomService.getAvailableRooms().then(function(rooms) {
          vm.rooms = rooms;
        });
      });

      function signin(username, room) {
        if (room) {
          RoomService.setRoom(room);
          UserService.signin(username).then(function (user) {
            if (user) {
              $state.go('home');
            }
          });
        }
      }
    }
  }
})();
