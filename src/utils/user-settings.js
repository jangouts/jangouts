/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * User Settings (user name, room id) in local storage so that they survive page refresh
 */
class UserSettings {
  static STORAGE_KEY = "jangouts-user-settings";

  /**
   * Creates new settings from local storage data
   *
   * @returns {UserSettings}
   */
  static load() {
    const storage = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};

    let settings = new UserSettings();
    settings.username = storage._username;
    settings.roomId = storage._roomId;

    return settings;
  }

  /**
   * Saves the settings into local storage
   */
  save() {
    localStorage.setItem(UserSettings.STORAGE_KEY, JSON.stringify(this));
  }

  get username() {
    return this._username;
  }

  set username(username) {
    this._username = username;
  }

  get roomId() {
    return this._roomId;
  }

  set roomId(roomId) {
    this._roomId = roomId;
  }
}

export default UserSettings;
