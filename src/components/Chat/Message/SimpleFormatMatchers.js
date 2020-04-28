/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

import React from 'react';
import { Matcher } from 'interweave';

// Base class for several Interweave matchers used for simple formatting
export class SimpleFormatMatcher extends Matcher {
  match(string) {
    return this.doMatch(string, this.regexp(), (matches) => ({
      start: matches[1],
      end: matches[2]
    }));
  }

  replaceWith(children, props) {
    const size = Math.min(props.start.length, props.end.length);
    return React.createElement(this.element(), { key: props.key }, this.trim(children, size));
  }

  asTag() {
    return this.element();
  }

  regexp() {
    const del = this.delimiter();
    return RegExp(`(${del}+)[^${del}]+(${del}+)`);
  }

  trim(children, size) {
    if (typeof children === 'string') {
      return children.slice(size, children.length - size);
    } else {
      return React.Children.map(children, (child, i) => {
        if (i === 0) return child.slice(size);

        if (i === children.length - 1) return child.slice(0, child.length - size);

        return child;
      });
    }
  }
}

// Custom Interweave matcher to render bold text
export class SimpleBoldMatcher extends SimpleFormatMatcher {
  delimiter() {
    return '\\*';
  }

  element() {
    return 'b';
  }
}

// Custom Interweave matcher to render italic text
export class SimpleItalicMatcher extends SimpleFormatMatcher {
  delimiter() {
    return '_';
  }

  element() {
    return 'i';
  }
}

// Custom Interweave matcher to render strikethrough text
export class SimpleStrikeMatcher extends SimpleFormatMatcher {
  delimiter() {
    return '~';
  }

  element() {
    return 's';
  }
}

// Custom Interweave matcher to render code snippets
export class SimpleCodeMatcher extends SimpleFormatMatcher {
  delimiter() {
    return '`';
  }

  element() {
    return 'code';
  }
}
