import jhSigninFormDirective from './jh-signin-form.directive';
import UserService from './user.service';

export default angular.module('janusHangouts.userComponent', [])
  .directive('jhSigninForm', jhSigninFormDirective)
  .service('UserService', UserService);

upgradeAdapter.upgradeNg1Provider('UserService');
