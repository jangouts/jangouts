(function () {
  'use strict';

  angular.module("janusHangouts.config", [])
    .provider('jhConfig', function () {
      var config = {
        "janusServer": "http://c2c-study-api.conects.com/yozume_rtc/52.78.142.118:8088",
        "janusServerSSL": "https://c2c-study-api.conects.com/yozume_rtc/52.78.142.118:8089",
        "janusDebug": true,
        "httpsAvailable": true,
        "httpsUrl": null,
        "videoThumbnails": true,
        "joinUnmutedLimit": 3,
        "enabledPlugins": []
      };

      return {
        $get: function () {
          return config;
        },
        $set: function(k, v) {
          config[k] = v;
        }
      };
    });
})();
