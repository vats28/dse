
angular.module('starter.pendingFollowupList', [])

    .controller('pendingFollowupListCtrl', function ($scope, $ionicPopup, generic_http_post_service, date_picker) {

        $scope.arrayList = {};
        
        $scope.$on('filterFollowups', function(event, data) { 
            $scope.filterFollowups();
        });
        $scope.showDetail = function (item) {
            $scope.sessionVariable.selected_enquiry = item;
            $scope.jumpTo('app.enquiryDetail');
        }


        $scope.init = function () {
            $scope.dataRefreshing = true;
            $scope.sessionVariable.ten_days_followup = {};
            $scope.find_10_days_data();
        }//end init
        
        $scope.find_10_days_data = function () {
            var ten_days_followup = null;
            try {
                ten_days_followup = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.TEN_DAY_FOLLOW));

            } catch (error) { }

            try {
                //if its already available dont
                if (ten_days_followup) {
                    $scope.sessionVariable.ten_days_followup = ten_days_followup;
                    if (!$scope.matchDate()) {
                        $scope.Fetch_10_days_Enquiry();
                    } else {
                        $scope.arrayList = ten_days_followup;
                        //alert(JSON.stringify(ten_days_followup));
                         $scope.dataRefreshing = false;
                    }
                } else {
                    $scope.Fetch_10_days_Enquiry();
                }
            } catch (error) {
                alert(error);
            }
        }

        ///This function is to check  wether saved 10 days data need to be refreshed 
        // we will fetch new data on new date only.       
        $scope.matchDate = function () {
            // alert("sdcd");
            var retval = false;
            try {
                if ($scope.sessionVariable.ten_days_followup.date) {
                    var currDate = date_picker.convertDateToString(new Date(), "mm/dd/yyyy");
                    // alert(currDate);

                    if (currDate == $scope.sessionVariable.ten_days_followup.date) {
                        retval = true;
                    }//end inner if
                }
            } catch (error) {
                //alert(error);
            }
            return retval;
        }



        $scope.Fetch_10_days_Enquiry = function () {
            $scope.requestData = {};
            $scope.requestData.user_id = $scope.sessionVariable.username;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_FOLLOW_UP,
                $scope.requestData, $scope.Fetch_10_days_Enquiry_callback);
        }
        

        $scope.Fetch_10_days_Enquiry_callback = function (data) {
            $scope.dataRefreshing = false;
            if (data.success == 1) {
                $scope.SaveInLocalStorage($scope.localStorageKeys.TEN_DAY_FOLLOW, JSON.stringify(data));
                $scope.sessionVariable.ten_days_followup = data;
                 $scope.arrayList.follow_up = data;
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }



    });
