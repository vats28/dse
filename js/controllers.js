angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $state, $ionicModal, $ionicPopup, $ionicHistory, $ionicScrollDelegate,
        $timeout, $ionicSideMenuDelegate, $ionicLoading, $ionicPlatform, generic_http_post_service, date_picker) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        $scope.headerButton = {};

        $scope.$on('$ionicView.enter', function (e) {
            var stateId = $ionicHistory.currentView().stateId;

            if (stateId == "app.searchEnquiryList") {
                $scope.headerButton.showFilter = true;
            } else {
                $scope.headerButton.showFilter = false;
            }
        });

        $ionicPlatform.registerBackButtonAction(function (event) {
            var stateId = $ionicHistory.currentView().stateId;

            if (stateId == "app.dashboard") {
                //do nothing
            } else {
                $scope.goBackScreen();
            }

        }, 100);

        // Form data for the login modal
        $scope.sessionVariable = {};

        $scope.sessionVariable.temp_cont_enq = {};//when both enq and ontact need to be added
        $scope.sessionVariable.temp_enq = {}; // when only enq need to be added
        $scope.sessionVariable.temp_cont = {}; // when only contact need to be added
        $scope.search_filter = {};
        $scope.InTesting = false;


        $scope.style = {};
        $scope.validationClass = Object.freeze({
            ERROR: 'ion-asterisk assertive',
            OK: 'ion-checkmark balanced'/*'ion-thumbsdown energized'*/
        });
        $scope.style.opacity = Object.freeze({
            FULL: 'opacity: 1;',
            ACTIVE: 'opacity: 0.3;',
            LIGHT: 'opacity: 0.5;',
        });

        $scope.localStorageKeys = Object.freeze({
            LOGIN: 'hero_dse_key',
            DISTRICT: 'dse_district',
            TEHSIL: 'dse_tehsil',
            VILLAGE: 'dse_village',
            STATE: 'dse_state',
            STATE_ID: 'dse_state_id',
            DISTRICT_ID: 'dse_district_id',
            TEHSIL_ID: 'dse_tehsil_id',
            MAKE_MODEL: 'dse_make_model',
            ALL_STATE: 'dse_all_state',
            ALL_DISTRICT: 'dse_all_district',
            USERNAME: 'username',
            TEN_DAY_FOLLOW: 'ten_day_follow'
        });

        $scope.SaveLoginCredential = function (data) {
            try {
                $scope.SaveInLocalStorage($scope.localStorageKeys.LOGIN, data)
            } catch (err) {
                alert(err);
            }
        }//end func

        $scope.showAlertWindow = function (text) {
            $ionicPopup.alert({
                title: text,
                //cancelType: 'color_grey',// String (default: 'button-default'). The type of the Cancel button.
                okType: 'positive'// String (default: 'OK'). The text of the OK button.
            }).then(function (res) {
                console.log('Your log ', res);
            });
        }

        $scope.showAlertWindow_Titled = function (title, template, callback, oktext) {


            $ionicPopup.alert({
                title: title,
                template: '<div align="center">' + template + '</div>',
                okText: oktext != null ? oktext : 'OK',
                okType: 'button-dark'
            }).then(function (res) {
                if (callback != null && callback != undefined) {
                    callback();
                }
                //this.close();
            });
        }//end

        $scope.testAlertWindow = function (msg) {
            if ($scope.InTesting)
                alert(msg);
        }// end  testAlertWindow

        $scope.doubleBack = function () {
            /*$ionicHistory.goBack();
             $ionicHistory.goBack();*/
            var backView = $ionicHistory.viewHistory().views[$ionicHistory.viewHistory().backView.backViewId];//$scope.$viewHistory.views[$scope.$viewHistory.backView.backViewId];
            $ionicHistory.viewHistory().forcedNav = {
                viewId: backView.viewId,
                navAction: 'moveBack',
                navDirection: 'back'
            };
            backView && backView.go();
        }// end

        $scope.goBackScreen = function () {
            $ionicHistory.goBack();

        }// end

        $scope.clearCache = function () {

            $ionicHistory.clearCache();

        }//end

        $scope.clearCacheAndHistory = function () {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();

        }//end

        $scope.clearHistory = function () {
            $ionicHistory.clearHistory();

        }//end

        $scope.disableBack = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            /* $ionicViewService.nextViewOptions({

             });*/
        }// end

        $scope.enableBack = function () {

            $ionicHistory.nextViewOptions({
                disableBack: false
            });
            /* $ionicViewService.nextViewOptions({

             });*/
        }// end

        $scope.scrollTop = function () {
            $ionicScrollDelegate.scrollTop();
        }

        $scope.jumpTo = function (pageName) {
            try {
                $state.go(pageName);
            } catch (err) {
                alert(err);
            }
        }//end

        $scope.jumpTo_cacheFalse = function (pageName) {
            try {

                //$scope.jumpTo(pageName);
                $state.go(pageName, { cache: false })
            } catch (err) {
                alert(err);
            }
        }//end

        $scope.enableSideMenuDrag = function () {
            $ionicSideMenuDelegate.canDragContent(true);
        }

        $scope.disableSideMenuDrag = function () {
            $ionicSideMenuDelegate.canDragContent(false);
        }

        $scope.resizePage = function () {
            $ionicScrollDelegate.resize();
        }

        $scope.showLoader = function (msg) {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-energized" style="float: left;"></ion-spinner>' + '<span style="margin-left: 5px;">' + msg + '</span>'//'<span class="icon spin ion-loading-d"></span> ' + msg

            });
        };
        $scope.hideLoader = function () {
            $ionicLoading.hide();
        };


        $scope.showToast = function (msg) {

            $ionicLoading.show({
                template: msg,
                delay: 500,
                duration: 2000

            });
        };

        // A confirm dialog
        $scope.showConfirm = function (title, template, callback) {
            $ionicPopup.confirm({
                title: title,
                template: template,
                okType: 'button-assertive',
                cancelType: 'button-dark'
            }).then(function (res) {
                if (res) {
                    console.log('You are sure');
                    if (callback) {
                        callback();
                    }
                } else {
                    console.log('You are not sure');
                }
            });
        };


        $scope.SaveInLocalStorage = function (key, value) {
            window.localStorage.setItem(key, value);
        }//end

        $scope.GetInLocalStorage = function (key) {
            return window.localStorage.getItem(key);
        }//end

        $scope.RemoveInLocalStorage = function (key) {
            window.localStorage.removeItem(key);
        }//end


        $scope.doLogout = function () {
            $scope.disableBack();
            $scope.jumpTo('app.landing');
            $scope.clearHistory();

            //now clear localstorage and variables of past user.
            $scope.sessionVariable = {};
            $scope.RemoveInLocalStorage($scope.localStorageKeys.STATE);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEHSIL);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.VILLAGE);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.STATE_ID);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.DISTRICT_ID);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEHSIL_ID);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.ALL_DISTRICT);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.ALL_STATE);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEN_DAY_FOLLOW);
        }




        $scope.get_district = function (state_id) {
            if (!$scope.sessionVariable.login_data.state_id) {
                $scope.showAlertWindow("Sorry", "Please select a state first");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.state_id = state_id.split(',')[0];//$scope.sessionVariable.login_data.state_id;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_DISTRICT,
                $scope.requestData, $scope.get_district_callback);

        };//end doLogin

        $scope.get_district_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.result != []) {
                $scope.sessionVariable.district_list = data.district;
                //alert($scope.localStorageKeys.DISTRICT);
                $scope.SaveInLocalStorage($scope.localStorageKeys.DISTRICT, JSON.stringify(data));
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


        $scope.get_tehsil = function () {
            if (!$scope.sessionVariable.login_data.district_id) {
                $scope.showAlertWindow("Sorry", "Please select a district first");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.district_id = $scope.sessionVariable.login_data.district_id.split(',')[0];
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_TEHSIL,
                $scope.requestData, $scope.get_tehsil_callback);
        };//end doLogin

        $scope.get_tehsil_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.result != []) {
                $scope.sessionVariable.tehsil_list = data.tehsil;
                $scope.SaveInLocalStorage($scope.localStorageKeys.TEHSIL, JSON.stringify(data));
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


        $scope.get_village = function () {
            if (!$scope.sessionVariable.login_data.district_id) {
                $scope.showAlertWindow("Sorry", "Please select a tehsil first");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.tehsil_id = $scope.sessionVariable.login_data.tehsil_id.split(',')[0];
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_VILLAGE,
                $scope.requestData, $scope.get_village_callback);
        };//end doLogin

        $scope.get_village_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.result != []) {
                $scope.sessionVariable.village_list = data.village;
                $scope.SaveInLocalStorage($scope.localStorageKeys.TEHSIL_ID, $scope.sessionVariable.login_data.tehsil_id);
                // $scope.SaveInLocalStorage($scope.localStorageKeys.VILLAGE, data.village);
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }

        $scope.get_fullstate_data = function () {
            if (!$scope.sessionVariable.login_data.state_id) {
                $scope.showAlertWindow("Sorry", "Please select a state first");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.state_id = $scope.sessionVariable.login_data.state_id.split(',')[0];
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_STATE_DATA,
                $scope.requestData, $scope.get_fullstate_data_callback);
        };//end doLogin

        $scope.get_fullstate_data_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.result != []) {
                $scope.sessionVariable.allStates = data;
                $scope.SaveInLocalStorage($scope.localStorageKeys.ALL_STATE, JSON.stringify(data));
                // $scope.SaveInLocalStorage($scope.localStorageKeys.VILLAGE, data.village);
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }

        $scope.get_full_district_data = function () {
            if (!$scope.sessionVariable.login_data.district_id) {
                $scope.showAlertWindow("Sorry", "Please select a district first");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.district_id = $scope.sessionVariable.login_data.district_id.split(',')[0];
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_DISTRICT_DATA,
                $scope.requestData, $scope.get_full_district_data_callback);
        };//end doLogin

        $scope.get_full_district_data_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.result != []) {
                $scope.sessionVariable.allDistrict = data;
                $scope.sessionVariable.tehsil_list = data.tehsil;
                $scope.sessionVariable.village_list = data.village;
                $scope.SaveInLocalStorage($scope.localStorageKeys.ALL_DISTRICT, JSON.stringify(data));
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


        $scope.get_make_model = function () {
            $scope.showLoader("");
            //$scope.requestData = {};
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().BIKE_MAKE_MODEL,
                $scope.requestData, $scope.get_make_model_callback);
        };//end doLogin

        $scope.get_make_model_callback = function (data) {
            $scope.hideLoader();
            //Falert(JSON.stringify(data));
            if (data.result != []) {
                $scope.sessionVariable.make_model_list = data;
                $scope.SaveInLocalStorage($scope.localStorageKeys.MAKE_MODEL, JSON.stringify(data));
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


        $scope.showCloseEnquiryModal = function (item) {
            if (item)
                $scope.sessionVariable.selected_enquiry = item;
            $scope.showModal('templates/popups/closeEnquiryModel.html');
        }
        $scope.showFollowupEnquiryModal = function (item) {
            if (item)
                $scope.sessionVariable.selected_enquiry = item;
            $scope.showModal('templates/popups/followupEnquiryPopup.html');
        }




        $scope.pickDate = function () {
            var allowOld = true;
            var allowFuture = false;
            date_picker.getDate('date', $scope.pickDob_callback, allowOld, allowFuture);
        };
        $scope.pickDob_callback = function (data) {
            var format = "dd/mm/yyyy";
            //$scope.reg.dob = date_picker.getDateInFormat(data.currDate, format);
            $scope.reg.dob = data.currDate;
        }


        $scope.isNumberKey = function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if (charCode != 46 && charCode > 31
                && (charCode < 48 || charCode > 57))
                return false;

            return true;
        }


        $scope.ConvertBoolToNumber = function (value) {
            var retval = 0;
            if (value) {
                retval = 1;
            }
            return retval;
        }

        $scope.getValueInJson = function (arr, keyvalue, keyname, required_key) {
            var retval = "";
            var keepGoing = true;

            angular.forEach(arr, function (value, key) {
                if (keepGoing) {
                    if (value[keyname] == keyvalue) {
                        retval = value[required_key];
                        keepGoing = false;
                    }
                }
            });

            return retval;
        }


        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        // Close the modal
        $scope.closeModal = function () {
            // $ionicBackdrop.release();
            $scope.modal.hide();
            $scope.modal.remove()
        };


    });
