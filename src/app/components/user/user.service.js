(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('UserService', ['$q', '$state', '$rootScope', UserService]);

  function UserService($q, $state, $rootScope) {
    this.user = null;

    this.signin = function (username) {
      var d = $q.defer();
      this.user = { username: username };
      d.resolve(this.user);
      return d.promise;
    };

    this.currentUser = function() {
      var d = $q.defer();
      if (this.user !== null) {
        $rootScope.$broadcast('user.set', this.user);
        d.resolve(this.user);
      } else {
        d.reject('Not signed in');
      }
      return d.promise;
    };

    this.signout = function() {
      var d = $q.defer();
      this.user = null;
      d.resolve();
      $rootScope.$broadcast('user.unset');
      $state.go('signin');
      return d.promise;
    };
  }
})();
