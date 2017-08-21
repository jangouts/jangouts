/**
 * @file      events.provider.js
 * @author    Bimalkant Lauhny <lauhny.bimalk@gmail.com>
 * @copyright MIT License
 * @brief     Creates an event emitter using a subject observable
 *            to which different services can subscribe
 */
(function () {
  'use strict';

  angular.module("janusHangouts.eventsProvider", [])
    .provider('jhEventsProvider', function () {
      var eventsConfig = {
        // username stores name of the user
        username: null,
        // roomDesc stores room name
        roomDesc: null,
        // eventsSubject stores a reference to window.Rx object
        eventsSubject: null,
        /**
         *  Emits event after adding opaqueId and timestamp to it 
         *  @param {object} event - carries 'type' and 'data' for event
         */
        emitEvent: function (event) {
          event['username'] = this.username; 
          event['roomDesc'] = this.roomDesc;
          // timestamp shows the time when event gets emitted
          event['timestamp'] = Date.now();
          this.eventsSubject.onNext(event);
        }
    };
      
      return {
        $get: function () {
          return eventsConfig;
        },
        $set: function(key, val) {
          eventsConfig[key] = val;
        }
      };
    });
})();
