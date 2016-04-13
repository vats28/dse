angular.module('starter.dashboard', [])

    .controller('dashboardCtrl', function($scope, generic_http_post_service, fileTransfer, $ionicPlatform) {


        $scope.sessionVariable.search = {};
        $scope.apkPath = '';
        $scope.directoryPath = '';

        $scope.menuList = [
            {
                name: 'Enquiries',
                badge: 1,
                icon: 'icon ion-ios-list assertive',
                link: 'app.enquiryList'
            },
            {
                name: 'Followups',
                badge: 3,
                icon: 'icon ion-chatboxes balanced',
                link: 'app.followupList'
            },
            {
                name: 'Contacts',
                badge: 0,
                icon: 'icon ion-android-contacts positive',
                link: 'app.contactList'
            },
        ];



        $scope.init = function() {
            //get make model
            //alert('sdcsdcs');
            var make_model_data = null;
            try {
                make_model_data = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.MAKE_MODEL));
                //alert(JSON.stringify(make_model_data));

                //if its already available dont
                if (make_model_data) {
                    $scope.sessionVariable.make_list = make_model_data.make;
                    $scope.sessionVariable.model_list = make_model_data.model;
                    $scope.sessionVariable.model_interested = make_model_data.model_interested;
                } else {
                    $scope.get_make_model();
                }
                //$scope.hideLoader();
            } catch (error) {
                alert(error);
            }

        }






        $scope.fetch_contact = function(state_id) {
            //$scope.jumpTo('app.contactList');
            //return;
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.user_id = $scope.sessionVariable.username;
            $scope.requestData.dealer_code = $scope.sessionVariable.login_data.dealer_code;
            $scope.requestData.phn_no = $scope.sessionVariable.search.phone ? $scope.sessionVariable.search.phone : "";
            $scope.requestData.reg_no = $scope.sessionVariable.search.regno ? $scope.sessionVariable.search.regno : "";

            // alert(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().FETCH_CONTACT,
                $scope.requestData, $scope.fetch_contact_callback);

        };//end doLogin

        $scope.fetch_contact_callback = function(data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            $scope.sessionVariable.temp_cont_enq = {};
            $scope.sessionVariable.temp_cont_enq.mobile = $scope.sessionVariable.search.phone;
            if (data.success == true) {
                $scope.sessionVariable.contact_list = data;
                $scope.jumpTo('app.contactList');
            } else if (data.success == 0) {
                $scope.showAlertWindow_Titled("Error", data.failure_msg ? data.failure_msg : "");
                $scope.sessionVariable.contact_list = undefined;
                // $scope.jumpTo('app.contactList');
            } else {
                //$scope.showAlertWindow_Titled("Error", data.respDescription + data.failure_msg?data.failure_msg : "");
                $scope.sessionVariable.contact_list = undefined;
                $scope.jumpTo('app.contactList');
            }
        }


        $scope.launchProductCatalogApp = function() {
            $scope.checkAppAvailability("com.ionicframework.gallapp343021");
        }//end 


        $scope.checkAppAvailability = function(pakageName) {
            //alert('we');
            navigator.startApp.check(pakageName, function(message) {
                $scope.startApp(pakageName);
            }, function(error) {
                $scope.downloadApp(pakageName);
            });
        }

        $scope.startApp = function(pakageName) {
            $scope.SaveInLocalStorage('Dealer', $scope.sessionVariable.login_data.dealer_code);
            navigator.startApp.start(pakageName, function(message) {  /* success */

                if ($scope.OS.ANDROID) {
                    //"action", "ACTION_NAME", "PACKAGE", "TYPE", "URI"
                    //navigator.startApp.start([["app.com.name", "app.com.name.Activity"], [{"product_id":"100"}]], ...);
                    //navigator.startApp.start([["action", "MAIN", "com.ionicframework.gallapp343021", "TYPE", "URI"]], function (message) { /* success */
                    navigator.startApp.start([["com.ionicframework.gallapp343021", "com.ionicframework.gallapp343021.MainActivity"], [{ "dse_id": $scope.sessionVariable.username }]], function(message) { /* success */
                        console.log(message); // => OK
                    }, function(error) { /* error */
                        console.log(error);
                    });
                } else if ($scope.OS.IOS) {
                    // not right now
                }
            }, function(error) { /* error */
                // console.log(error);
            });
        }

        $scope.downloadApp = function(pakageName) {
            $scope.showLoader("Downloading pakage");
            if ($scope.OS.ANDROID) {
                $scope.apkPath = "http://tab.hmcl.biz/HeroProduct/HeroProducts.apk";
                //fileTransfer.downloadInOuterDirectory($scope.installApk, $scope.apkPath, 'hero/hero-dse', 'HeroProducts.apk');//downloadFile($scope.installApk, url);// (callback, url, targetPath, options)
                $scope.directoryPath = cordova.file.externalRootDirectory + 'Download/';
                window.resolveLocalFileSystemURL($scope.directoryPath, $scope.fileDownload());
            } else if ($scope.OS.IOS) {
                //window.open('itms://itunes.apple.com/us/app/vc-rep/id904432520?mt=8');
            } else {

            }
        }

        $scope.installApk = function(data, err) {
            // alert('installing');
            //$scope.hideLoader();
            if (data == -1) {
                alert(JSON.stringify(data));
                $scope.hideLoader();
                $scope.showAlertWindow_Titled("Error", err);
            } else if (data == -2) {

            } else {
                alert('after successfully download ' + JSON.stringify(data));
                $scope.hideLoader();
                var filePath = data.nativeURL;//"/mnt/sdcard/" + 'hero/hero-dse' + "/" + 'HeroProducts.apk';

                cordova.plugins.fileOpener2.open(
                    filePath,
                    'application/vnd.android.package-archive'
                );

                //location.reload(true);
            }


        }//installapk



        $scope.fileDownload = function() {
            var fileTransfer = new FileTransfer();
            $scope.apkPath = encodeURI($scope.apkPath);
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
                    alert(error);
                }//end catch
            };

            fileTransfer.download($scope.apkPath, $scope.directoryPath + 'HeroProducts.apk', function(HeroProducts) {
                $scope.installApk();
            }, function(error) {
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
                    $scope.directoryPath + 'HeroProducts.apk',
                    'application/vnd.android.package-archive'
                );
                // location.reload(true);

            }//installapk

        }//end fileDOwnload





    });
