/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from "lodash";

import { Injectable } from "@angular/core";

interface IRoomAttributes {
  description: string;
  record: string;
  room: number;
  max_publishers: number;
  num_participants: number;
  fir_freq: number;
  bitrate: number;
}

/**
 * Represents data about video chat room. Provides attributes from /etc/janus/janus.plugin.videoroom.cfg
 */
@Injectable()
export class Room {

  public id: number;
  public label: string;
  public description: string;
  public record: string;
  public room: number;
  public max_publishers: number;
  public num_participants: number;
  public fir_freq: number;
  public bitrate: number;

  constructor(attrs: any = {}) {
    _.assign(this, attrs);

    this.id = this.room; // room identifier

    // room label including number of participants
    this.label = `${this.description} (${this.num_participants}/${this.max_publishers} users)`;
  }

}
