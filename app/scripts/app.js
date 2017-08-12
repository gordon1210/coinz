'use strict';

/**
 * @ngdoc overview
 * @name coinz
 * @description
 * # coinz
 *
 * Main module of the application.
 */
angular.module('coinz', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
]).config([
    '$routeProvider', '$localStorageProvider',
    function ($routeProvider, $localStorageProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerAs: 'main'
        }).when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl',
            controllerAs: 'about'
        }).otherwise({
            redirectTo: '/'
        });
    }
]).filter('tsuffix', function () {
    return function (input, decimals) {
        var exp, rounded,
            suffixes = ['K', 'M', 'B', 'T', 'Q'];

        if (window.isNaN(input)) {
            return null;
        }

        if (input < 1000) {
            return input ? input.toFixed(decimals) : input;
        }

        exp = Math.floor(Math.log(input) / Math.log(1000));

        rounded = (input / Math.pow(1000, exp)).toFixed(decimals) + ' ' + suffixes[exp - 1];
        return rounded;
    };
});