/**
 * Copyright (c) [2020] SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

/**
 * Helper to simplify to build the cssClass conditionally
 *
 * @param {String} CSS classes to join
 * @returns {String} final cssClass properly joined
 */
function classNames(...classes) {
  return classes.filter((item) => !!item).join(' ');
}

export { classNames };
