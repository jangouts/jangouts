(function () {
  angular.module('janusHangouts')
    .service('UsersService', ['$q', '$state', UserService]);

  function UserService($q, $state) {
    this.user = null;

    this.signin = function (username) {
      var d = $q.defer();
      this.user = { username: username }
      d.resolve(this.user);
      return d.promise;
    };

    this.currentUser = function() {
      var d = $q.defer();
      if (this.user !== null) {
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
      $state.go('signin');
      return d.promise;
    };
  }
})();
