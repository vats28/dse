'use.strict'
/*
 * common/constants.js
 *
 * (c) 2014 Vincent Maliko http://frnchnrd.com
 * License: MIT
 */

angular.module('utils.http_post', [])

    .factory('generic_http_post_service', function($http, $timeout) {
        var server_host = 'http://tab.hmcl.biz/';
        var server_api_path = 'dse_app_UAT/';
        //server_api_path = 'dse_app_live/'; //live server path
        var services_address = Object.freeze({
            LOGIN: server_host + server_api_path + 'login.php',
            GET_DISTRICT: server_host + server_api_path + 'get_district.php',
            GET_TEHSIL: server_host + server_api_path + 'get_tehsil.php',
            GET_VILLAGE: server_host + server_api_path + 'get_village.php',
            BIKE_MAKE_MODEL: server_host + server_api_path + 'bike_make_model.php',
            GET_DISTRICT_DATA: server_host + server_api_path + 'get_district_data.php',
            GET_STATE_DATA: server_host + server_api_path + 'get_state_data.php',
            LATLONG: server_host + server_api_path + 'latlong.php',
            FETCH_CONTACT: server_host + server_api_path + 'fetch_contact.php',
            SYNC_RECORDS: server_host + server_api_path + 'syncRecords.php',
            SYNC_FOLLOW_UP: server_host + server_api_path + 'sync_follow_up.php',
            GET_FOLLOW_UP: server_host + server_api_path + 'get_follow_up.php',
            CHECK_VERSION: server_host + server_api_path + 'check_version.php',
            FETCH_CAMPAIGN_DATA: server_host + server_api_path + 'fetch_campaign_data.php',
            //CHECK_VERSION.php
        });

        var networkError = {
            success: 0,
            failure_title: 'Error',
            failure_msg: 'Something went wrong',
            error_code: 101
        };
        var networkTimeout = {
            success: 0,
            failure_title: 'Error',
            failure_msg: 'Something went wrong',
            error_code: 101
        };
        var code = "punar";
        var isTimedOut = false;
        return {
            getServices: function() { return services_address },
            getDetails: function(API, requestData, callback) {
                //alert(JSON.stringify(requestData));
                isTimedOut = true;
                var encrypt_data = {};
                var encrypted = CryptoJS.AES.encrypt(JSON.stringify(JSON.stringify(requestData)), "dse", { format: CryptoJSAesJson }).toString();
                //var decrypted = JSON.parse(CryptoJS.AES.decrypt(encrypted, "dse", { format: CryptoJSAesJson }).toString(CryptoJS.enc.Utf8));


                encrypt_data.data = encrypted;
                $http.post(API, encrypt_data).
                    success(function(data, status, headers, config) {
                        //alert("data" + JSON.stringify(data));
                        isTimedOut = false;
                        try {
                            // window.analytics.trackEvent('webservice', API, 'success', 'http_post');
                        } catch (err) {

                        }
                        callback(data);
                    }).
                    error(function(data, status, headers, config) {
                        // alert("data" + JSON.stringify(data));
                        //alert("status : " + JSON.stringify(status));
                        //  alert("headers" + JSON.stringify(headers));
                        //  alert("config" + JSON.stringify(config));
                        // window.analytics.trackEvent('webservice', API, 'fail', 'http_post');
                        isTimedOut = false;
                        callback(networkError);
                    });

            },
            getDetails_httpget: function(API, requestData, callback) {
                isTimedOut = true;
                // alert("data" + JSON.stringify(requestData));
                API += '?';
                // angular.forEach(requestData, function (value, key) {
                //     API += key + '=' + value + '&';
                // });
                API += 'data=' + rc4(code, "hello dsc");

                //alert(API);
                $http.get(API, { timeout: 1000 * 20 }).
                    success(function(data, status, headers, config) {

                        isTimedOut = false;
                        callback(data);
                    }).
                    error(function(data, status, headers, config) {
                        //alert("data" + JSON.stringify(data));
                        //alert("status : " + JSON.stringify(status));
                        //alert("headers" + JSON.stringify(headers));
                        //alert("config" + JSON.stringify(config));
                        isTimedOut = false;
                        callback(networkError);
                    });

            }
        }
    });
