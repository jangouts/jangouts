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

export {
  classNames,
  discardFalses
};
