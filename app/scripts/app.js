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
    'ngTouch'
]).config(['$routeProvider', function ($routeProvider) {
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
]);