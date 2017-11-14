/**
 * @file      events.service.js
 * @author    Bimalkant Lauhny <lauhny.bimalk@gmail.com>
 * @copyright MIT License
 * @brief     Creates an event emitter using a subject observable
 *            to which different services can subscribe
 */
(function () {
  'use strict';

  angular.module("janusHangouts")
    .service('EventsService', EventsService);

  /**
   * Service to emit relevant events that can be later consumed by a plugin.
   *
   * @constructor
   * @memberof module:janusHangouts
   */
  function EventsService() {
    // User currently logged in
    var user = null;
    // Room currently in use
    var room = null;
    // eventsSubject stores a reference to window.Rx object
    var eventsSubject = null;

    /*
     * Initializes the events system.
     *
     * This must be called before any call to emitEvent.
     */
    this.init = function() {
      // setting Rx Subject
      eventsSubject = new window.Rx.Subject();
      if (eventsSubject === null || eventsSubject === undefined) {
        console.error("Could not load rx.js! Event emitter will not work.");
      }
    };

    /*
     * Sets the information about the current signed-in user that will be
     * appended as status information to all the emitted messages.
     */
    this.setUser = function(value) { user = value; };

    /*
     * Sets the information about the room currently in use that will be
     * appended as status information to all the emitted messages.
     */
    this.setRoom = function(value) { room = value; };

    /*
     * Subject to which the plugins must subscribe in order to react to the
     * emitted events.
     */
    this.getEventsSubject = function() { return eventsSubject; };

    /**
     *  Emits event after adding timestamp and status information to it
     *  @param {object} event - carries 'type' and 'data' for event
     */
    this.emitEvent = function(event) {
      event.user = user;
      event.room = room;
      // timestamp shows the time when event gets emitted
      event.timestamp = Date.now();
      if (eventsSubject === null || eventsSubject === undefined) {
        console.log("Event emitter is not configured. Event not emitted");
      } else {
        eventsSubject.onNext(event);
      }
    };
  }
}());
