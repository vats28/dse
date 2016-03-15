angular.module('starter.dashboard', [])

    .controller('dashboardCtrl', function ($scope,  generic_http_post_service) {


        $scope.sessionVariable.search = {};



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



        $scope.init = function () {
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
                } else {
                    $scope.get_make_model();
                }
                //$scope.hideLoader();
            } catch (error) {
                alert(error);
            }

        }






        $scope.fetch_contact = function (state_id) {
            $scope.jumpTo('app.contactList');
            return;
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.user_id = $scope.sessionVariable.username;
            $scope.requestData.phn_no = $scope.sessionVariable.search.phone;
            $scope.requestData.reg_no = $scope.sessionVariable.search.regno;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().FETCH_CONTACT,
                $scope.requestData, $scope.fetch_contact_callback);

        };//end doLogin

        $scope.fetch_contact_callback = function (data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.success == true ) {
                alert('true');
                $scope.sessionVariable.contact_list = data.contact;
                $scope.jumpTo('app.contactList');
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }



    });
