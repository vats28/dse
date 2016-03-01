angular.module('starter.landing', [])

    .controller('landingCtrl', function ($scope, $cordovaOauth, generic_http_post_service) {

        
        // Form data for the login modal

        $scope.sessionVariable.username = '10375G01';
        $scope.sessionVariable.password = 'pass@123';

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
                alert(error);
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
                if (!$scope.sessionVariable.password) {
                    $scope.showAlertWindow_Titled('Sorry', 'Please enter password');
                    return;
                }


                $scope.showLoader("Logging in...");
                $scope.requestData = {};
                $scope.requestData.username = $scope.sessionVariable.username;
                $scope.requestData.password = $scope.sessionVariable.password;
                $scope.requestData.imei = '0';
                generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().LOGIN, $scope.requestData, $scope.doLogin_callback);
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
                //alert(JSON.stringify($scope.sessionVariable.username));
                //$scope.sessionVariable.isLoggedIn = false;
                // $scope.sessionVariable.login_data = data;

                // //store login credentials
                // try {
                //     $scope.SaveLoginCredential(JSON.stringify(data))
                // } catch (error) {
                //     alert(error)
                // }
                $scope.clearHistory();
                $scope.disableBack();
                $scope.jumpTo('app.dashboard');
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


    });
