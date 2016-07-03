import { upgradeAdapter } from "./adapter";

export default angular.module("janusHangouts.config", [])
    .factory('jhConfig', function () {
      return {
        "janusServer"     : null,
        "janusServerSSL"  : null,
        "janusDebug"      : false,
        "httpsAvailable"  : true,
        "httpsUrl"        : null,
        "videoThumbnails" : true,
        "joinUnmutedLimit": 3,
      };
    });

upgradeAdapter.upgradeNg1Provider('jhConfig');
