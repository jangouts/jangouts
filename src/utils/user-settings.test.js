/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import UserSettings from "./user-settings";

beforeEach(() => {
  localStorage.clear();
});

describe('load', () => {
  it('creates settings from the local storage', () => {
    let data = { username: "test", roomId: "1234" };
    localStorage.setItem(UserSettings.STORAGE_KEY, JSON.stringify(data));

    const settings = UserSettings.load();

    expect(settings.username).toEqual("test");
    expect(settings.roomId).toEqual("1234");
  });
});

describe('save', () => {
  it('saves the settings into local storage', () => {
    const settings = new UserSettings();
    settings.username = "test";
    settings.roomId = "1234";

    settings.save();

    const plainSettings = settings.toPlain();
    expect(localStorage.getItem(UserSettings.STORAGE_KEY)).toEqual(JSON.stringify(plainSettings));
  });
});
