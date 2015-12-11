/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

(function () {
  'use strict';

  angular.module('janusHangouts')
    .service('UserService', UserService);

  UserService.$inject = ['localStorageService'];

  function UserService(localStorageService) {
    var USER_SETTINGS_KEY = 'userSettings'; // 'const' is not available in all platforms.
    this.user = null;
    this.settings = localStorageService.get(USER_SETTINGS_KEY) || {};

    /*
     * Returns the current (signed in) user.
     * @returns {object} An object representing the user like
     *                   { username: 'some-name' }
     */
    this.getUser = function() {
      return this.user;
    };

    /*
     * Sign in a user.
     * @param   {string} username Username.
     * @returns {object} An object representing the user like
     */
    this.signin = function(username) {
      this.setSetting('lastUsername', username);
      this.user = { username: username };
    };

    /*
     * Get all user settings.
     * @returns {object} An object containing all the settings.
     */
    this.getSettings = function() {
      return this.settings;
    };

    /*
     * Get the value for a given user setting.
     * @param   {string} key User setting key.
     * @returns {}       The value for the given setting.
     */
    this.getSetting = function(key) {
      return this.settings[key];
    };

    /*
     * Remove a user setting.
     * @param   {string} key User setting key.
     * @returns {boolean}    True if the element was removed.
     */
    this.removeSetting = function(key) {
      delete this.settings[key];
      this.storeSettings();
    };

    /*
     * Clear user settings.
     * @returns {boolean} True if storage was cleared.
     */
    this.clearSettings = function() {
      this.settings = {};
      return localStorageService.clearAll(USER_SETTINGS_KEY);
    };

    /*
     * Set the value for a given user setting.
     * @param   {string} key User setting key.
     * @param   {}       value User setting value.
     */
    this.setSetting = function(key, value) {
      this.settings[key] = value;
      this.storeSettings();
    };

    /*
     * Store settings in the local storage.
     *
     * This function is not supposed to be called by users of the API.
     *
     * @private
     */
    this.storeSettings = function() {
      localStorageService.set(USER_SETTINGS_KEY, this.settings);
    };
  }
})();
