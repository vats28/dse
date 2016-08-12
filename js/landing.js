angular.module('starter.landing', [])

    .controller('landingCtrl', function ($scope, $cordovaDevice, $rootScope, generic_http_post_service) {


        // Form data for the login modal


        $scope.init = function () {
            //if already logged in then  jump to next page
            var loginData = null;
            try {
                loginData = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.STATE));
                if (loginData) { // do login with previously available data                
                    $scope.sessionVariable.username = $scope.GetInLocalStorage($scope.localStorageKeys.USERNAME);

                    $scope.doLogin_callback(loginData);
                }
            } catch (error) {
                console.log("init : " + error);
            }
        }

        $scope.doLogin = function () {
            //alert('wcdw');
            //$scope.jumpTo('app.dashboard');
            //return;
            try {
                if (!$scope.sessionVariable.username) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter username or email-id');
                    return;
                }
                // if (!$scope.sessionVariable.password) {
                //     $scope.showAlertWindow_Titled('Sorry', 'Please enter password');
                //     return;
                // }


                $scope.showLoader("Logging in...");
                $scope.requestData = {};
                $scope.requestData.username = $scope.sessionVariable.username;
                // $scope.requestData.password = "";//$scope.sessionVariable.password;
                if (!$scope.OS.DESKTOP) {
                    $scope.requestData.version = AppVersion.version;
                    $scope.requestData.uuid = $cordovaDevice.getUUID();
                    if (!$scope.OS.IOS) {
                        try {
                            $scope.requestData.imei = $rootScope.IMEI;
                            if (!$scope.requestData.imei)
                                $scope.requestData.imei = '0';
                        } catch (error) {
                            $scope.requestData.imei = '0';
                            Console.log('Error in imei : ' + error);
                        }
                    }
                } else {
                    $scope.requestData.version = '1.0';
                    $scope.requestData.imei = '0';
                    $scope.requestData.uuid = '0';
                }
                console.log(JSON.stringify($scope.requestData));
                generic_http_post_service.getDetails(generic_http_post_service.getServices().LOGIN, $scope.requestData, $scope.doLogin_callback);
            } catch (error) {
                alert(error);
            }
        };//end doLogin

        $scope.doLogin_callback = function (data) {
            $scope.hideLoader();
            //$scope.jumpTo('app.dashboard');
            //return;
            //{"result":true,"respDescription":"Valid User","respCode":1}

            if (data.result == true) {
                $scope.sessionVariable.login_data = data;
                $scope.sessionVariable.state_list = data.state;
                $scope.sessionVariable.login_data.state_id = data.state_id;

                $scope.SaveInLocalStorage($scope.localStorageKeys.STATE, JSON.stringify(data));
                $scope.SaveInLocalStorage($scope.localStorageKeys.STATE_ID, data.state_id);
                $scope.SaveInLocalStorage($scope.localStorageKeys.USERNAME, $scope.sessionVariable.username);


                $scope.clearHistory();
                $scope.disableBack();
                $scope.jumpTo('app.dashboard');
            } else {
                $scope.showAlertWindow_Titled("Error", data.failure_msg, null, null);
            }
        }

        $scope.showAppDetail = function () {
            try {
                var msg = '';
                msg += "<p><b>Device id : <b>" + $cordovaDevice.getUUID() + "</p>";
                //msg += "<p><b>Device serial : <b>"+$cordovaDevice.serial()+"</p></br>";
                msg += "<p><b>version : <b>" + AppVersion.version + "   <b>Build : <b>" + AppVersion.build + "</p>";
                $scope.showAlertWindow_Titled("App Detail", msg);
            } catch (error) {
                alert(error);
            }
        }//emd



    });
