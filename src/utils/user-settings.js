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
   * Creates new settings from local storage data, if any
   *
   * @returns {(UserSettings|null)}
   */
  static load() {
    const storage = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};

    if (Object.keys(storage).length === 0)
      return null;

    let settings = new UserSettings();

    if (storage._username !== undefined)
      settings.username = storage._username;
    if (storage._roomId !== undefined)
      settings.roomId = storage._roomId;
    if (storage._chatOpen !== undefined)
      settings.chatOpen = storage._chatOpen;

    return settings;
  }

  constructor() {
    this._username = null;
    this._roomId = null;
    this._chatOpen = false;
  }

  /**
   * Saves the settings into local storage
   */
  save() {
    localStorage.setItem(UserSettings.STORAGE_KEY, JSON.stringify(this));
  }

  /**
   * @returns {(String|null)}
   */
  get username() {
    return this._username;
  }

  /**
   * @param {(String)} username
   */
  set username(username) {
    this._username = username;
  }

  /**
   * @returns {(String|null)}
   */
  get roomId() {
    return this._roomId;
  }

  /**
   * @param {String} roomId
   */
  set roomId(roomId) {
    this._roomId = roomId;
  }

  /**
   * @returns {Boolean}
   */
  get chatOpen() {
    return this._chatOpen;
  }

  /**
   * @param {Booelan} chatOpen
   */
  set chatOpen(chatOpen) {
    this._chatOpen = chatOpen;
  }
}

export default UserSettings;
