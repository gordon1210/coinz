'use strict';

/**
 * @ngdoc function
 * @name coinz.directive:coinbox
 * @description
 * # coinbox
 * directive of the coinz
 */
angular.module('coinz').directive('coinbox', function () {
    return {
        restrict: 'E',
        scope: {
            coin: '='
        },
        templateUrl: 'templates/coinbox.html'
    };
});