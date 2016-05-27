/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

function jhFooterDirective() {
  return {
    restrict: 'EA',
    template: require('./jh-footer.html'),
    scope: true
  };
}

export default jhFooterDirective;
