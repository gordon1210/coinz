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
    '$scope', '$http', '$timeout', '$q', '$localStorage',
    function ($scope, $http, $timeout, $q, $localStorage) {
        var self = this;

        var defaults = {
            coindata: [],
            lastrefresh: 0,
            minbtc: 0.00000005,
            maxbtc: 0,
            maxwinnerlooser: 40,
            globaldata: {
                'total_market_cap_usd': 0,
                'total_24h_volume_usd': 0,
                'bitcoin_percentage_of_market_cap': 0,
                'active_currencies': 0,
                'active_assets': 0,
                'active_markets': 0
            },
            toplists: {
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
                    data: [],
                    length: 12
                },
                'marketcap': {
                    key: 'market_cap_usd',
                    reverse: false,
                    data: [],
                    length: 12
                }
            }
        };

        self.local = $localStorage.$default(angular.copy(defaults));
        self.loading = false;

        self.clearcache = function () {
            self.local.$reset();
            self.local = $localStorage.$default(angular.copy(defaults));
            self.refresh();
        };

        self.resetbtc = function () {
            self.local.maxbtc = angular.copy(defaults.maxbtc);
            self.local.minbtc = angular.copy(defaults.minbtc);
        };

        self.changed = function () {
            var satoshi = 100000000;
            if (self.local.maxbtc > 0 && self.local.minbtc >= self.local.maxbtc) {
                self.local.minbtc = self.local.maxbtc - (1 / satoshi);
            }
            if (self.local.maxbtc === 0) return;
            if (self.local.maxbtc <= self.local.minbtc) {
                self.local.maxbtc = self.local.minbtc + (1 / satoshi);
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
                'percent_change_7d': parseFloat
            };

            angular.forEach(self.local.coindata, function (value, key) {
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

            var coindata = angular.copy(self.local.coindata);

            coindata.sort(function (a, b) {
                if (a[field] >= b[field])
                    return -1;
                if (a[field] < b[field])
                    return 1;
                return 0;
            });

            var coindata = coindata.filter(function (x) {
                return self.local.maxbtc > 0
                    ? x['price_btc'] > self.local.minbtc && x['price_btc'] < self.local.maxbtc
                    : x['price_btc'] > self.local.minbtc;
            });

            sortCache[field] = angular.copy(coindata);

            return coindata;
        };

        var getTopTen = function (field, reverse, length, offset) {
            offset = offset ? offset : 0;

            var iswinner = null;

            var pFields = [
                'percent_change_1h',
                'percent_change_24h',
                'percent_change_7d'
            ];

            var coindata = getSortedBy(field, iswinner);

            if (reverse) {
                coindata.reverse();
            }

            if (~pFields.indexOf(field)) {
                iswinner = !reverse;
            }

            var coindata = coindata.filter(function (x) {
                if (iswinner !== null && iswinner && x[field] <= 0) {
                    return false;
                }

                if (iswinner !== null && !iswinner && x[field] > 0) {
                    return false;
                }

                return true;
            });

            return coindata.slice(offset, length + offset);
        };

        var timeout = null;

        var call = function () {
            sortCache = {};
            $timeout.cancel(timeout);

            var minute = 1000 * 60;

            timeout = $timeout(function () {
                call();
            }, minute + 100);

            if (self.local.lastrefresh + minute > Date.now()) {
                return;
            }

            self.loading = true;

            $http({
                method: 'GET',
                url: 'https://api.coinmarketcap.com/v1/ticker/?convert=EUR&timestamp=' + Date.now()
            }).then(function (response) {
                self.local.coindata = response.data;
                coindataParseNumbers();

                self.local.lastrefresh = Date.now();

                for (var toplist in self.local.toplists) {
                    $q(function () {
                        var o = self.local.toplists[toplist];
                        var key = o.key;
                        var reverse = o.reverse;
                        var length = o.length ? o.length : 36;

                        self.local.toplists[toplist].data = getTopTen(key, reverse, length);
                    });
                }

                self.loading = false;
            }, function (response) {
                self.loading = false;
                throw response;
            });

            $http({
                method: 'GET',
                url: 'https://api.coinmarketcap.com/v1/global/?convert=EUR&timestamp=' + Date.now()
            }).then(function (response) {
                self.local.globaldata = response.data;
            }, function (response) {
                throw response;
            });
        };

        call();

        self.refresh = function () {
            console.log('refreshing');
            self.local.lastrefresh = 0;
            call();
        };
    }
]);
