import RequestService from './request.service';
import StatesService from './states.service';

export default angular.module('janusHangouts.routerComponent', [])
  .service('RequestService', RequestService)
  .service('StatesService', StatesService);

export { RequestService };
