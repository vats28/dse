// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'ngCordovaOauth', 'starter.controllers', 'starter.landing', 'starter.createEnquiry',
    'starter.addVehicleInfo', 'starter.add_personal_info', 'starter.enquiryList', 'starter.enquiryDetail', 'starter.searchFilter',
    'starter.dashboard', 'starter.contactList', 'starter.contactDetail', 'starter.vehicleDetail', 'starter.createNewEnquiry',
    'starter.followupList', 'starter.searchEnquiryList', 'starter.closeEnquiryModal', 'starter.followupEnquiryModal',
    'starter.pendingFollowupList','starter.emiCalc',
    'utils.date_picker', 'ion-fab-button', 'utils.http_post', 'utils.fileTransfer', 'utils.validations'], function ($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    })

    .run(function($ionicPlatform, $cordovaFile, $rootScope, $timeout) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            $timeout(function() {
                $rootScope.$broadcast('check_version', 'close');
            }, 2000);


        });

    })

    .filter('unique', function() {
        return function(collection, keyname) {
            var output = [],
                keys = [];

            angular.forEach(collection, function(item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        };
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.landing', {
                url: '/landing',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/landing.html'
                    }
                }
            })

            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard.html'
                    }
                }
            })

            .state('app.createEnquiry', {
                url: '/createEnquiry',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/enquiry/createEnquiry/createEnquiry.html'
                    }
                }
            })

            .state('app.createNewEnquiry', {
                url: '/createNewEnquiry',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/enquiry/createEnquiry/createNewEnquiry.html'
                    }
                }
            })

            .state('app.add_personal_info', {
                url: '/add_personal_info',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/enquiry/createEnquiry/add_personal_info.html'
                    }
                }
            })

            .state('app.add_vehicle_info', {
                url: '/add_vehicle_info',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/enquiry/createEnquiry/add_vehicle_info.html'
                    }
                }
            })

            .state('app.enquiryList', {
                url: '/enquiryList',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/enquiry/enquiryList.html'
                    }
                }
            })

            .state('app.enquiryDetail', {
                url: '/enquiryDetail',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/enquiry/enquiryDetail.html'
                    }
                }
            })

            .state('app.followupList', {
                url: '/followupList',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/followup/followupList.html'
                    }
                }
            })

            .state('app.pendingFollowupList', {
                url: '/pendingFollowupList',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/followup/pendingFollowupList.html'
                    }
                }
            })

            .state('app.contactList', {
                url: '/contactList',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact/contactList.html'
                    }
                }
            })

            .state('app.contactDetail', {
                url: '/contactDetail',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/contact/contactDetail.html'
                    }
                }
            })

            .state('app.vehicleDetail', {
                url: '/vehicleDetail',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/vehicle/vehicleDetail.html'
                    }
                }
            })

            .state('app.searchFilter', {
                url: '/searchFilter',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/popups/searchFilter.html'
                    }
                }
            })

            .state('app.searchEnquiryList', {
                url: '/searchEnquiryList',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/enquiry/searchEnquiry/searchEnquiryList.html'
                    }
                }
            })

            .state('app.emi_calc', {
                url: '/emi_calc',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/emi_calc/emi_calc.html'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/landing');
    });

function getController(controllerName) {
    var scope = angular.element(document.querySelector('[ng-controller=' + controllerName + ']')).scope();
    return scope;
}