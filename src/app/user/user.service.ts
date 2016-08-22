/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import { Injectable } from "@angular/core";

const USER_SETTINGS_KEY: string = "userSettings";

interface IUSER {
  username: string;
}

@Injectable()
export class UserService {

  public user: IUSER = null;
  public settings: any = {};

  constructor() {
    this.settings = this.get(USER_SETTINGS_KEY) || {};
  }

  /*
   * Returns the current (signed in) user.
   * @returns {object} An object representing the user like
   *                   { username: "some-name" }
   */
  public getUser(): IUSER {
    return this.user;
  }

  /*
   * Sign in a user.
   * @param   {string} username Username.
   * @returns {object} An object representing the user like
   */
  public signin(username: string): void {
    this.setSetting("lastUsername", username);
    this.user = { username: username };
  }

  /*
   * Get all user settings.
   * @returns {object} An object containing all the settings.
   */
  public getSettings(): any {
    return this.settings;
  }

  /*
   * Get the value for a given user setting.
   * @param   {string} key User setting key.
   * @returns {}       The value for the given setting.
   */
  public getSetting(key: string): any {
    return this.settings[key];
  }

  /*
   * Remove a user setting.
   * @param   {string} key User setting key.
   * @returns {boolean}    True if the element was removed.
   */
  public removeSetting(key: string): void {
    delete this.settings[key];
    this.storeSettings();
  }

  /*
   * Clear user settings.
   */
  public clearSettings(): void {
    this.settings = {};
    this.storeSettings();
  }

  /*
   * Set the value for a given user setting.
   * @param   {string} key User setting key.
   * @param   {}       value User setting value.
   */
  public setSetting(key: string, value: any): void {
    this.settings[key] = value;
    this.storeSettings();
  }

  /*
   * Store settings in the local storage.
   *
   * This function is not supposed to be called by users of the API.
   */
  private storeSettings(): void {
    this.set(USER_SETTINGS_KEY, this.settings);
  }

  private get(key: string): any {
    return JSON.parse(localStorage.getItem(`jh.${key}`));
  }

  private set(key: string, value: any): void {
    localStorage.setItem(`jh.${key}`, JSON.stringify(value));
  }
}
