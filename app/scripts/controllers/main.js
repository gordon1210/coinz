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
    '$http',
    function ($http) {
        var self = this;

        self.coindata = [];

        self.toplists = {
            //winner, looser
            'winner1h': [],
            'looser1h': [],
            'winner24h': [],
            'looser24h': [],
            'winner7d': [],
            'looser7d': [],
            //market cap, volume24h
            'volume24': [],
            'marketcap': []
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

        var getSortedBy = function (field) {
            var coindata = angular.copy(self.coindata);

            coindata.sort(function (a, b) {
                if (a[field] >= b[field])
                    return -1;
                if (a[field] < b[field])
                    return 1;
                return 0;
            });

            return coindata;
        };

        var getTopTen = function (field, length, reverse) {
            var coindata = getSortedBy(field);
            if (reverse) {
                coindata.reverse();
            }
            coindata.length = length;
            return coindata;
        };

        $http({
            method: 'GET',
            url: 'https://api.coinmarketcap.com/v1/ticker/?convert=EUR'
        }).then(function (response) {
            self.coindata = response.data;
            coindataParseNumbers();

            self.toplists.winner1h = getTopTen('percent_change_1h', 10);
            self.toplists.looser1h = getTopTen('percent_change_1h', 10, true);

            self.toplists.winner24h = getTopTen('percent_change_24h', 10);
            self.toplists.looser24h = getTopTen('percent_change_24h', 10, true);

            self.toplists.winner7d = getTopTen('percent_change_7d', 10);
            self.toplists.looser7d = getTopTen('percent_change_7d', 10, true);

            self.toplists.volume24 = getTopTen('24h_volume_usd', 10);
            self.toplists.marketcap = getTopTen('market_cap_usd', 10);

            console.log(self.toplists);
        }, function (response) {
            throw response;
        });
    }
]);
