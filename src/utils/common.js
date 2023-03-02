/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * Helper to simplify to build the cssClass conditionally
 *
 * TODO: add unit tests
 *
 * @param {String} CSS classes to join
 * @returns {String} final cssClass properly joined
 */
function classNames(...classes) {
  return classes.filter((item) => !!item).join(' ');
}

/**
 * Helper to discard non truly values in a collection
 *
 * TODO: add unit tests
 *
 * @param {Array} collection to clean
 * @returns {Array} a new collection without false values
 */
function discardFalses(collection) {
  return collection.filter((i) => i);
}

/**
 * Helper to attach a stream to a video element
 *
 * @param {HTMLVideoElement} element of the DOM to attach the stream to
 * @param {MediaStream} WebRTC stream
 */
function attachStream(element, stream) {
  try {
    // In fact, this should work in all relatively new browsers. So maybe the
    // whole function could be dropped in favor of this line.
    element.srcObject = stream;
  } catch (e) {
    try {
      element.src = URL.createObjectURL(stream);
    } catch (e) {
      console.error("Error attaching stream to element");
    }
  }
}

export {
  attachStream,
  classNames,
  discardFalses
};
