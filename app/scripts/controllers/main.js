/* global parseInt, parseFloat */

'use strict';

/**
 * @ngdoc function
 * @name coinz.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the coinz

 imgurl for logos https://files.coinmarketcap.com/static/img/coins/64x64/*id*.png

 */
angular.module('coinz').controller('MainCtrl', [
    '$http', '$q',
    function ($http, $q) {
        var self = this;

        self.coindata = [];
        /*
         *                 self.toplists.winner1h = getTopTen('percent_change_1h', 10);
         });
         $q(function () {
         self.toplists.looser1h = getTopTen('percent_change_1h', 10, true);
         });
         $q(function () {
         self.toplists.winner24h = getTopTen('percent_change_24h', 10);
         });
         $q(function () {
         self.toplists.looser24h = getTopTen('percent_change_24h', 10, true);
         });
         $q(function () {
         self.toplists.winner7d = getTopTen('percent_change_7d', 10);
         });
         $q(function () {
         self.toplists.looser7d = getTopTen('percent_change_7d', 10, true);
         });
         $q(function () {
         self.toplists.volume24 = getTopTen('24h_volume_usd', 10);
         });
         $q(function () {
         self.toplists.marketcap = getTopTen('market_cap_usd', 10);
         */


        self.toplists = {
            //winner, looser
            'winner1h': {
                key: 'percent_change_1h',
                reverse: false,
                data: []
            },
            'looser1h': {
                key: 'percent_change_1h',
                reverse: true,
                data: []
            },
            'winner24h': {
                key: 'percent_change_24h',
                reverse: false,
                data: []
            },
            'looser24h': {
                key: 'percent_change_24h',
                reverse: true,
                data: []
            },
            'winner7d': {
                key: 'percent_change_7d',
                reverse: false,
                data: []
            },
            'looser7d': {
                key: 'percent_change_7d',
                reverse: true,
                data: []
            },
            //market cap, volume24h
            'volume24': {
                key: '24h_volume_usd',
                reverse: false,
                data: []
            },
            'marketcap': {
                key: 'market_cap_usd',
                reverse: false,
                data: []
            }
        };

        var coindataParseNumbers = function () {
            var parse = {
                'rank': parseInt,
                'price_usd': parseFloat,
                'price_btc': parseFloat,
                'price_eur': parseFloat,
                '24h_volume_usd': parseFloat,
                '24h_volume_eur': parseFloat,
                'market_cap_usd': parseFloat,
                'market_cap_eur': parseFloat,
                'available_supply': parseFloat,
                'total_supply': parseFloat,
                'percent_change_1h': parseFloat,
                'percent_change_24h': parseFloat,
                'percent_change_7d': parseFloat,
            };

            angular.forEach(self.coindata, function (value, key) {
                for (var field in parse) {
                    if (value[field] !== null && value[field] !== undefined) {
                        value[field] = parse[field](value[field]);
                    }
                }
            });
        };

        var sortCache = {};

        var getSortedBy = function (field) {
            if (sortCache[field] !== undefined) {
                return angular.copy(sortCache[field]);
            }

            var coindata = angular.copy(self.coindata);

            coindata.sort(function (a, b) {
                if (a[field] >= b[field])
                    return -1;
                if (a[field] < b[field])
                    return 1;
                return 0;
            });

            sortCache[field] = angular.copy(coindata);

            return coindata;
        };

        var getTopTen = function (field, reverse, length, offset) {
            var coindata = getSortedBy(field);
            if (reverse) {
                coindata.reverse();
            }
            return coindata.slice(offset ? offset : 0, length + offset);
        };

        $http({
            method: 'GET',
            url: 'https://api.coinmarketcap.com/v1/ticker/?convert=EUR'
        }).then(function (response) {
            self.coindata = response.data;
            coindataParseNumbers();

            var length = 100;
            var steps = 10;

            for (var i = 0; i < length; i += steps) {
                for (var toplist in self.toplists) {
                    $q(function () {
                        var arr = getTopTen(self.toplists[toplist].key, self.toplists[toplist].reverse, steps, i);
                        for (var x in arr) {
                            console.log('pushing in: ' + toplist + ' i=' + i + ' x=' + x);
                            self.toplists[toplist].data.push(arr[x]);
                        }
                    });
                }
            }

            console.log(self.toplists);
        }, function (response) {
            throw response;
        });
    }
]);
