/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { Matcher } from 'interweave';
import { URL_PATTERN } from 'interweave-autolink';

// Custom Interweave matcher to directly render urls that point to an image
export default class ImgMatcher extends Matcher {
  match(string) {
    const response = this.doMatch(string, URL_PATTERN, (matches) => ({
      src: matches[0],
      path: matches[5] || ''
    }));

    if (response && response.path.match(/\.(jpg|jpeg|png|gif)$/)) {
      return response;
    } else {
      return null;
    }
  }

  replaceWith(children, props) {
    return (
      <span className="img-matcher" key={props.key}>
        {children}
        <img alt={props.key} src={props.src} onLoad={props.onRender} />
      </span>
    );
  }

  asTag() {
    return 'span';
  }
}
