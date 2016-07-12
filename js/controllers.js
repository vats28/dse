angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $state, $ionicModal, $ionicPopup, $ionicHistory, $ionicScrollDelegate,
        $timeout, $ionicSideMenuDelegate, $ionicLoading, $ionicPlatform, generic_http_post_service, date_picker) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        $scope.headerButton = {};
        $scope.OS = {
            ANDROID: false,
            IOS: false,
            DESKTOP: true,
        }

        $scope.$on('$ionicView.enter', function(e) {
            var stateId = $ionicHistory.currentView().stateId;

            if (stateId == "app.searchEnquiryList") {
                $scope.headerButton.showFilter = true;
            } else {
                $scope.headerButton.showFilter = false;
            }
        });

        $ionicPlatform.registerBackButtonAction(function(event) {
            var stateId = $ionicHistory.currentView().stateId;

            if (stateId == "app.dashboard") {
                //do nothing
                backAsHome.trigger(function() {
                    //console.log("Success");
                }, function() {
                    //console.log("Error");
                })
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
        $scope.mkey = "vats";


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
            TEN_DAY_FOLLOW: 'ten_day_follow',
            PENDING_ORDERS: 'pending_orders'
        });

        $scope.SaveLoginCredential = function(data) {
            try {
                $scope.SaveInLocalStorage($scope.localStorageKeys.LOGIN, data)
            } catch (err) {
                alert(err);
            }
        }//end func

        $scope.showAlertWindow = function(text) {
            $ionicPopup.alert({
                title: text,
                //cancelType: 'color_grey',// String (default: 'button-default'). The type of the Cancel button.
                okType: 'positive'// String (default: 'OK'). The text of the OK button.
            }).then(function(res) {
                console.log('Your log ', res);
            });
        }

        $scope.showAlertWindow_Titled = function(title, template, callback, oktext) {


            $ionicPopup.alert({
                title: title,
                template: '<div align="center">' + template + '</div>',
                okText: oktext != null ? oktext : 'OK',
                okType: 'button-dark'
            }).then(function(res) {
                if (callback != null && callback != undefined) {
                    callback();
                }
                //this.close();
            });
        }//end

        $scope.testAlertWindow = function(msg) {
            if ($scope.InTesting)
                alert(msg);
        }// end  testAlertWindow

        $scope.doubleBack = function() {
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

        $scope.goBackScreen = function() {
            $ionicHistory.goBack();

        }// end

        $scope.clearCache = function() {

            $ionicHistory.clearCache();

        }//end

        $scope.clearCacheAndHistory = function() {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();

        }//end

        $scope.clearHistory = function() {
            $ionicHistory.clearHistory();

        }//end

        $scope.disableBack = function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            /* $ionicViewService.nextViewOptions({

             });*/
        }// end

        $scope.enableBack = function() {

            $ionicHistory.nextViewOptions({
                disableBack: false
            });
            /* $ionicViewService.nextViewOptions({

             });*/
        }// end

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        }

        $scope.jumpTo = function(pageName) {
            try {
                $state.go(pageName);
            } catch (err) {
                alert(err);
            }
        }//end

        $scope.jumpTo_cacheFalse = function(pageName) {
            try {

                //$scope.jumpTo(pageName);
                $state.go(pageName, { cache: false })
            } catch (err) {
                alert(err);
            }
        }//end

        $scope.enableSideMenuDrag = function() {
            $ionicSideMenuDelegate.canDragContent(true);
        }

        $scope.disableSideMenuDrag = function() {
            $ionicSideMenuDelegate.canDragContent(false);
        }

        $scope.resizePage = function() {
            $ionicScrollDelegate.resize();
        }

        $scope.showLoader = function(msg) {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" class="spinner-energized" style="float: left;"></ion-spinner>' + '<span style="margin-left: 5px;">' + msg + '</span>'//'<span class="icon spin ion-loading-d"></span> ' + msg

            });
        };
        $scope.hideLoader = function() {
            $ionicLoading.hide();
        };


        $scope.showToast = function(msg) {

            $ionicLoading.show({
                template: msg,
                delay: 500,
                duration: 2000

            });
        };

        // A confirm dialog
        $scope.showConfirm = function(title, template, data, callback) {
            $ionicPopup.confirm({
                title: title,
                template: template,
                okType: 'button-assertive',
                cancelType: 'button-dark'
            }).then(function(res) {
                if (res) {
                    console.log('You are sure');
                    if (callback) {
                        callback(data);
                    }
                } else {
                    console.log('You are not sure');
                }
            });
        };


        $scope.SaveInLocalStorage = function(key, value) {
            var encryptValue = rc4($scope.mkey, value);
            window.localStorage.setItem(key, encryptValue.toString());
        }//end

        $scope.GetInLocalStorage = function(key) {
            var encryptValue = window.localStorage.getItem(key);
            var decryptValue = null;
            if (encryptValue) {
                decryptValue = rc4($scope.mkey, window.localStorage.getItem(key));
            }
            return decryptValue;
        }//end

        $scope.RemoveInLocalStorage = function(key) {
            window.localStorage.removeItem(key);
        }//end

        $scope.askLogout = function() {
            $scope.showConfirm('Do you really want to logout?', 'This may discard your pending changes. If you still want to logout then press yes otherwise no', null, $scope.doLogout);
        }//end            

        $scope.doLogout = function() {
            $scope.disableBack();
            $scope.jumpTo('app.landing');
            $scope.clearHistory();

            //now clear localstorage and variables of past user.
            $scope.sessionVariable = {};


            $scope.RemoveInLocalStorage($scope.localStorageKeys.LOGIN);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.DISTRICT);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEHSIL);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.VILLAGE);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.STATE);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.STATE_ID);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.DISTRICT_ID);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEHSIL_ID);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.MAKE_MODEL);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.ALL_STATE);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.ALL_DISTRICT);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.USERNAME);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEN_DAY_FOLLOW);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.PENDING_ORDERS);
        }




        $scope.get_district = function(state_id, callback) {
            if (!state_id) {
                $scope.showAlertWindow_Titled("Sorry", "Please select a state first");
                return;
            }
            if (!callback) {
                callback = $scope.get_district_callback;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.state_id = state_id.split(',')[0];//$scope.sessionVariable.login_data.state_id;
            generic_http_post_service.getDetails(generic_http_post_service.getServices().GET_DISTRICT,
                $scope.requestData, callback);

        };//end doLogin

        $scope.get_district_callback = function(data) {
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


        $scope.get_tehsil = function() {
            if (!$scope.sessionVariable.login_data.district_id) {
                $scope.showAlertWindow_Titled("Sorry", "Please select a district first");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.district_id = $scope.sessionVariable.login_data.district_id.split(',')[0];
            generic_http_post_service.getDetails(generic_http_post_service.getServices().GET_TEHSIL,
                $scope.requestData, $scope.get_tehsil_callback);
        };//end doLogin

        $scope.get_tehsil_callback = function(data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.result != []) {
                $scope.sessionVariable.tehsil_list = data.tehsil;
                $scope.SaveInLocalStorage($scope.localStorageKeys.TEHSIL, JSON.stringify(data));
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


        $scope.get_village = function() {
            if (!$scope.sessionVariable.login_data.district_id) {
                $scope.showAlertWindow_Titled("Sorry", "Please select a tehsil first");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.tehsil_id = $scope.sessionVariable.login_data.tehsil_id.split(',')[0];
            generic_http_post_service.getDetails(generic_http_post_service.getServices().GET_VILLAGE,
                $scope.requestData, $scope.get_village_callback);
        };//end doLogin

        $scope.get_village_callback = function(data) {
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

        $scope.get_fullstate_data = function() {
            if (!$scope.sessionVariable.login_data.state_id) {
                $scope.showAlertWindow_Titled("Sorry", "Please select a state first");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.state_id = $scope.sessionVariable.login_data.state_id.split(',')[0];
            generic_http_post_service.getDetails(generic_http_post_service.getServices().GET_STATE_DATA,
                $scope.requestData, $scope.get_fullstate_data_callback);
        };//end doLogin

        $scope.get_fullstate_data_callback = function(data) {
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

        $scope.get_full_district_data = function(district_id, callback) {
            if (!district_id) {
                $scope.showAlertWindow_Titled("Sorry", "Please select a district first");
                return;
            }
            if (!callback) {
                callback = $scope.get_full_district_data_callback;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.district_id = district_id.split(',')[0];
            generic_http_post_service.getDetails(generic_http_post_service.getServices().GET_DISTRICT_DATA,
                $scope.requestData, callback);
        };//end doLogin

        $scope.get_full_district_data_callback = function(data) {
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


        $scope.get_make_model = function() {
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.user_id = $scope.sessionVariable.username;
            generic_http_post_service.getDetails(generic_http_post_service.getServices().BIKE_MAKE_MODEL,
                $scope.requestData, $scope.get_make_model_callback);
        };//end doLogin

        $scope.get_make_model_callback = function(data) {
            $scope.hideLoader();
            //Falert(JSON.stringify(data));
            if (data.result != []) {
                $scope.sessionVariable.make_model_list = data;
                $scope.sessionVariable.make_list = data.make;
                $scope.sessionVariable.model_list = data.model;
                $scope.sessionVariable.model_interested = data.model_interested;
                $scope.SaveInLocalStorage($scope.localStorageKeys.MAKE_MODEL, JSON.stringify(data));
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


        $scope.fetchCampaign = function(model) {
            if (!model) {
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.user_id = $scope.sessionVariable.username;
            $scope.requestData.dealer_code = $scope.sessionVariable.login_data.dealer_code;
            generic_http_post_service.getDetails(generic_http_post_service.getServices().FETCH_CAMPAIGN_DATA,
                $scope.requestData, $scope.fetchCampaign_callback);
        }

        $scope.fetchCampaign_callback = function(data) {
            $scope.hideLoader();
            if (data.success == 1) {
                $scope.sessionVariable.campaign = data;
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


        $scope.showCloseEnquiryModal = function(item) {
            if (item)
                $scope.sessionVariable.selected_enquiry = item;
            $scope.showModal('templates/popups/closeEnquiryModel.html');
        }
        $scope.showFollowupEnquiryModal = function(item) {
            if (item)
                $scope.sessionVariable.selected_enquiry = item;
            $scope.showModal('templates/popups/followupEnquiryPopup.html');
        }




        $scope.pickDate = function() {
            var allowOld = true;
            var allowFuture = false;
            date_picker.getDate('date', $scope.pickDob_callback, allowOld, allowFuture);
        };
        $scope.pickDob_callback = function(data) {
            var format = "dd/mm/yyyy";
            //$scope.reg.dob = date_picker.getDateInFormat(data.currDate, format);
            $scope.reg.dob = data.currDate;
        }


        $scope.isNumberKey = function(evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if (charCode != 46 && charCode > 31
                && (charCode < 48 || charCode > 57))
                return false;

            return true;
        }


        $scope.ConvertBoolToNumber = function(value) {
            var retval = 0;
            if (value) {
                retval = 1;
            }
            return retval;
        }

        $scope.getValueInJson = function(arr, keyvalue, keyname, required_key) {
            var retval = "";
            var keepGoing = true;

            angular.forEach(arr, function(value, key) {
                if (keepGoing) {
                    if (value[keyname] == keyvalue) {
                        retval = value[required_key];
                        keepGoing = false;
                    }
                }
            });

            return retval;
        }


        $scope.showModal = function(templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        // Close the modal
        $scope.closeModal = function() {
            // $ionicBackdrop.release();
            $scope.modal.hide();
            $scope.modal.remove()
        };

        $scope.closeKeyBoard = function() {
            cordova.plugins.Keyboard.close();
        }//edn

        $scope.call = function(number) {
            $scope.showConfirm('Are you sure?', 'Call this number<br/>' + number, number, $scope.call_callback);
        }

        $scope.call_callback = function(number) {

            launchCall(number);
        }

        $scope.email = function(email) {
            $scope.showConfirm('Are you sure?', 'Email this to<br/>' + email, email, $scope.email_callback);
        }

        $scope.email_callback = function(email) {
            launchMail(email);
        }

        $scope.$on('check_version', function(event, data) {
            $scope.check_version();
        });

        $scope.check_version = function() {
            $scope.requestData = {};
            $scope.requestData.version = AppVersion.version;
            $scope.sessionVariable.version = AppVersion.version;
            generic_http_post_service.getDetails(generic_http_post_service.getServices().CHECK_VERSION,
                $scope.requestData, $scope.check_version_callback);

            console.log("current apk version : " + AppVersion.version);
        }//end 

        $scope.version = {};
        $scope.check_version_callback = function(data) {

            try {
                $scope.version = data;
                console.log("current apk version : " + AppVersion.version + ", New version : " + data.version);
                if (parseFloat(data.version) > parseFloat(AppVersion.version)) {
                    //app version changed
                    console.log("current apk version : " + AppVersion.version + ", New version : " + data.version);
                    $scope.showAlertWindow_Titled("Update",
                        "New version of this app is available please update to continue", $scope.downloadNewVersion);

                    return;
                }
            } catch (error) {
                alert(error);
            }
        }//end 


        $scope.downloadNewVersion = function() {
            $scope.showLoader("Downloading pakage");
            if ($scope.OS.ANDROID) {
                $scope.apkPath = $scope.version.path;
                $scope.directoryPath = cordova.file.externalRootDirectory + 'Download/';
                window.resolveLocalFileSystemURL($scope.directoryPath, $scope.fileDownload());
            } else if ($scope.OS.IOS) {
                //window.open('itms://itunes.apple.com/us/app/vc-rep/id904432520?mt=8');
            } else {

            }
        }//end downloadApp



        $scope.fileDownload = function() {
            var fileTransfer = new FileTransfer();
            $scope.apkPath = encodeURI($scope.apkPath);
            console.log("download path : " + $scope.apkPath);
            console.log("directory path : " + $scope.directoryPath + 'HeroDse.apk');
            fileTransfer.onprogress = function(progressEvent) {

                try {
                    if (progressEvent.lengthComputable) {
                        var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);

                        var showDown = perc + "% Downloaded...";
                        $scope.showLoader(showDown);
                    } else {
                        $scope.showLoader("Downloading...");
                    }
                }//end try
                catch (error) {
                    $scope.hideLoader();
                    alert(error);
                }//end catch
            };

            fileTransfer.download($scope.apkPath, $scope.directoryPath + 'HeroDse.apk', function(HeroProducts) {
                $scope.installApk();
            }, function(error) {
                $scope.hideLoader();
                $scope.showAlertWindow_Titled("Sorry", "Your download failed.");
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            }, true, {
                    headers: {
                        "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                    }
                });

            $scope.installApk = function() {
                // alert('installing');
                $scope.hideLoader();
                cordova.plugins.fileOpener2.open(
                    $scope.directoryPath + 'HeroDse.apk',
                    'application/vnd.android.package-archive'
                );
                location.reload(true);

            }//installapk

        }//end fileDOwnload
    });
