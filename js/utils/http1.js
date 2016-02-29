'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.http_post', [])

    .factory('generic_http_post_service', function ($http, $timeout) {
        var server_host = 'http://tab.hmcl.biz/';//tab.hmcl.biz/dse_app/login.php
        var server_api_path = 'dse_app/';
        var services_address = Object.freeze({
            LOGIN: server_host + server_api_path + 'login.php',
            GET_DISTRICT: server_host + server_api_path + 'get_district.php', // state_id
            GET_TEHSIL: server_host + server_api_path + 'get_tehsil.php', // district_id
            GET_VILLAGE: server_host + server_api_path + 'get_village.php', // tehsil_id
            BIKE_MAKE_MODEL: server_host + server_api_path + 'bike_make_model.php',
            LATLONG: server_host + server_api_path + 'latlong.php',
        });

        var networkError = {
            success: 0,
            failure_title: 'Error',
            failure_msg: 'No Network Connectivity',
            error_code: 101
        };
        var networkTimeout = {
            success: 0,
            failure_title: 'Error',
            failure_msg: 'ohh oh! connection timeout',
            error_code: 101
        };
        var isTimedOut = false;
        return {
            getServices: function () { return services_address },
            getDetails: function (API, requestData, callback) {
                isTimedOut = true;

                $http.post(API, requestData).
                    success(function (data, status, headers, config) {
                        //alert("data" + JSON.stringify(data));
                        isTimedOut = false;
                        try {
                            // window.analytics.trackEvent('webservice', API, 'success', 'http_post');
                        } catch (err) {

                        }
                        callback(data);
                    }).
                    error(function (data, status, headers, config) {
                       // alert("data" + JSON.stringify(data));
                         alert("status : " + JSON.stringify(status));
                        //  alert("headers" + JSON.stringify(headers));
                        //  alert("config" + JSON.stringify(config));
                        // window.analytics.trackEvent('webservice', API, 'fail', 'http_post');
                        isTimedOut = false;
                        callback(networkError);
                    });

                //call timeout if gets late in calling
                /* $timeout(function () {
                 if(isTimedOut)
                 callback(networkTimeout);
                 }, 10000);// five seconds timeout*/
            },
            getDetails_httpget: function (API, requestData, callback) {
                isTimedOut = true;
                // alert("data" + JSON.stringify(requestData));
                API += '?';
                angular.forEach(requestData, function (value, key) {
                    API += key + '=' + value + '&';
                });
                
                //alert(API);
                $http.get(API).
                    success(function (data, status, headers, config) {

                        isTimedOut = false;
                        callback(data);
                    }).
                    error(function (data, status, headers, config) {
                        alert("data" + JSON.stringify(data));
                        alert("status : " + JSON.stringify(status));
                        //alert("headers" + JSON.stringify(headers));
                        //alert("config" + JSON.stringify(config));
                        isTimedOut = false;
                        callback(networkError);
                    });

            }
        }
    });
