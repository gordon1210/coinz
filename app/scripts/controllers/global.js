/* global parseInt, parseFloat */

'use strict';

/**
 * @ngdoc function
 * @name coinz.controller:GlobalCtrl
 * @description
 * # GlobalCtrl
 * Controller of the coinz

 imgurl for logos https://files.coinmarketcap.com/static/img/coins/64x64/*id*.png

 */
angular.module('coinz').controller('GlobalCtrl', [
    '$localStorage',
    function ($localStorage) {
        var self = this;

        self.local = $localStorage;

        self.switchtheme = function () {
            if (angular.isUndefined(self.local.darktheme)) {
                return;
            }
            self.local.darktheme = !self.local.darktheme;
        };
    }
]);
