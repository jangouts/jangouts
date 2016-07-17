/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

// [TODO] - Review if attrs should be optionals (see `configure` method)
export interface IWanted {
  audio?: boolean;
  video?: boolean;
}

export interface IOptions {
  values?: IWanted;
  ok?(): void;
}

/**
 * Handles the status of the configuration flags (audio and video) of the
 * connection to Janus keeping them synced client and server side.
 *
 * It handles correctly several consequent changes of the flag values
 * keeping the number of requests to a minimum.
 */
export class ConnectionConfig {

  private pluginHandle: any;
  private current: IWanted;
  private requested: IWanted;
  private wanted: IWanted = {
    audio: true,
    video: true
  };
  private okCallback: any;

  constructor(pluginHandle: any, wantedInit: IWanted, jsep: any, ok?: any) {
    this.pluginHandle = pluginHandle;
    _.assign(this.wanted, wantedInit);

    // initial configure
    this.configure({jsep: jsep, ok: ok});
  }

  /**
   * Gets the current value of the configuration flags
   * @returns values of the audio and video flags
   */
  public get(): IWanted {
    return this.current;
  }

  /**
   * Sets the desired value of the configuration flags.
   *
   * It sends a configure request to the Janus server to sync the values
   * if needed (and updates the local representation according).
   *
   * @param options object containing
   *                * values: object with the wanted values for the flags
   *                * ok: callback to execute on confirmation from Janus
   */
  public set(options: IOptions = {}): void {
    options.values = options.values || {};

    let oldWanted: any = {};
    _.assign(oldWanted, this.current, this.wanted);
    _.assign(this.wanted, this.current, options.values);

    if (this.requested === null && this.differsFromWanted(oldWanted)) {
      this.configure({ok: options.ok});
    }
  }

  /**
   * Processes the confirmation (received from Janus) of the ongoing config
   * request
   */
  public confirm(): void {
    if (this.requested === null) {
      console.error("I haven't sent a config. Where does this confirmation come from?");
    } else {
      this.current = this.requested;
      this.requested = null;
      console.log("Connection configured", this.current);
      if (this.okCallback) { this.okCallback(); }
      if (this.differsFromWanted(this.current)) {
        this.configure();
      }
    }
  }

  private differsFromWanted(obj: IWanted): boolean {
    return (obj.video !== this.wanted.video || obj.audio !== this.wanted.audio);
  }

  private configure(options: {jsep?: any, ok?(): void } = {}): void {
    let config: any = {request: "configure"};
    this.requested = {};

    _.assign(this.requested, this.current, this.wanted);
    _.assign(config, this.requested);

    this.pluginHandle.send({
      message: config,
      jsep: options.jsep,
      success: (): void => {
        this.okCallback = options.ok;
      },
      error: (): void => {
        this.requested = null;
        console.error("Config request not sent");
      }
    });
  }


}
