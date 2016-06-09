/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import * as _ from 'lodash';

/**
 * Represents data about video chat room. Provides attributes from /etc/janus/janus.plugin.videoroom.cfg
 * @memberof module:janusHangouts
 */
function roomFactory() {
  return function(attrs) {
    attrs = attrs || {};

    _.assign(this, attrs);
    /** @var {Integer} id - room identifier */
    this.id = this.room;
    /** @var {String} label - room label including number of participants */
    this.label = this.description + " (" + this.num_participants + "/" + this.max_publishers + " users)";
  };
}

export default roomFactory;
