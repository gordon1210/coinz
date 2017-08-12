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
            coin: '=',
            size: '@?',
            change: '@?'
        },
        templateUrl: 'templates/coinbox.html',
        link: function (scope) {
            var getsize = function () {
                switch (scope.size) {
                    case 'small':
                        return '16x16';
                    case 'medium':
                        return '32x32';
                    case 'big':
                    default:
                        return '64x64';
                }
            };

            scope.percentChange = function () {
                return scope.change ? scope.coin[scope.change] : scope.coin['percent_change_24h'];
            };

            scope.imgurl = function () {
                return 'https://files.coinmarketcap.com/static/img/coins/' + getsize() + '/' + scope.coin.id + '.png';
            };
        }
    };
});