(function () {
  'use strict';

  angular.module('janusHangouts')
    .directive('jhFeed', jhFeed);

  function jhFeed() {
    return {
      restrict: 'EA',
      templateUrl: 'app/components/room/jh-feed.html',
      scope: {
        feed: '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: JhFeedCtrl,
      link: jhFeedLink,
    };
  }

  function jhFeedLink(scope, element, attrs) {
    scope.$watch('vm.feed', function(newVal) {
      if (newVal !== undefined) {
        attachMediaStream($('video', element)[0], newVal.stream);
      }
    });
  }

  function JhFeedCtrl() {
    /* jshint: validthis */
    var vm = this;
  }
})();
