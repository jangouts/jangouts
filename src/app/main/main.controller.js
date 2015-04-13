(function () {
  'use strict';

  angular.module('janusHangouts')
    .controller('MainCtrl', ['$rootScope', 'RoomService', MainCtrl]);

  function MainCtrl($rootScope, RoomService) {
    var vm = this;
    vm.localStream = undefined;

    vm.enter = function () {
      RoomService.enter(1234, 'trololo');
    }

    $rootScope.$on('stream.create', function(evt, stream) {
      debugger;
      attachMediaStream(angular.element('#main-video')[0], stream);

    });

  }
})();
