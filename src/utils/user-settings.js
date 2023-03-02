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

  constructor() {
    this._username = null;
    this._roomId = null;
    this._chatOpen = false;
  }

  /**
   * Creates new settings from local storage data, if any
   *
   * @returns {(UserSettings|null)}
   */
  static load() {
    const storage = JSON.parse(localStorage.getItem(this.STORAGE_KEY));

    if (!storage) { return null }

    return this.fromPlain(storage);
  }

  /**
   * Creates new settings from plain object
   *
   * @param {Object} plainSettings
   * @returns {UserSettings}
   */
  static fromPlain(plainSettings) {
    let settings = new UserSettings();

    if (plainSettings.username !== undefined)
      settings.username = plainSettings.username;
    if (plainSettings.roomId !== undefined)
      settings.roomId = plainSettings.roomId;
    if (plainSettings.chatOpen !== undefined)
      settings.chatOpen = plainSettings.chatOpen;

    return settings;
  }

  /**
   * Converts to plain object
   *
   * @returns {Object}
   */
  toPlain() {
    return {
      username: this.username,
      roomId: this.roomId,
      chatOpen: this.chatOpen
    };
  }

  /**
   * Saves the settings into local storage
   */
  save() {
    const plainSettings = this.toPlain();
    localStorage.setItem(UserSettings.STORAGE_KEY, JSON.stringify(plainSettings));
  }

  /**
   * @returns {(String|null)}
   */
  get username() {
    return this._username;
  }

  /**
   * @param {String} username
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
