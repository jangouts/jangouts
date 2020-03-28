/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { Node } from 'interweave';
import { UrlMatcher } from 'interweave-autolink';

export default class ImgMatcher extends UrlMatcher {
  replaceWith(children: ChildrenNode, props: UrlProps): Node {
    return (
      <span className="img-matcher">
        {children}
        <img src={props.url} />
      </span>
    );
  }

  asTag(): string {
    return 'span';
  }

  match(string: string): MatchResponse<UrlMatch> | null {
    const response = super.match(string);

    if (response && response.urlParts.path.match(/\.(jpg|jpeg|png|gif)$/)) {
      return response;
    } else {
      return null;
    }
  }
}
