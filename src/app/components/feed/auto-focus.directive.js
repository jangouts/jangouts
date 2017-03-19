/*
 * Copyright (C) 2015 SUSE Linux
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 * 
 * This module implements conditional autofocus functionality
 * for input
 */

'use strict';

angular.module('janusHangouts')
  .directive('autoFocus', [ '$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (scope.$eval(attrs.autoFocus) !== false) {
          $timeout(function() {
            scope.$emit('focus', element[0]);
              element[0].focus();
          });
        }
      }
    };
}]);
