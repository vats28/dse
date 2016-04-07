
angular.module('starter.followupList', [])

    .controller('followupListCtrl', function ($scope, $ionicPopup, generic_http_post_service, date_picker) {

        $scope.arrayList = {};
        $scope.$on('filterFollowups', function (event, data) {
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
                        filterFollowups();
                    }
                } else {
                    $scope.Fetch_10_days_Enquiry();
                }
            } catch (error) {
                alert(error);
            }
        }




        $scope.Fetch_10_days_Enquiry = function () {
            $scope.requestData = {};
            $scope.requestData.user_id = $scope.sessionVariable.username;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().GET_FOLLOW_UP,
                $scope.requestData, $scope.Fetch_10_days_Enquiry_callback);
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

        $scope.Fetch_10_days_Enquiry_callback = function (data) {
            $scope.dataRefreshing = false;
            if (data.success == 1) {

                $scope.SaveInLocalStorage($scope.localStorageKeys.TEN_DAY_FOLLOW, JSON.stringify(data));
                $scope.sessionVariable.ten_days_followup = {};
                $scope.sessionVariable.ten_days_followup = data;
                filterFollowups();
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }



        function filterFollowups() {
            try {
                var finance = undefined;
                if ($scope.search_filter.finance == 2) {
                    finance = 'Y';
                } else if ($scope.search_filter.finance == 3) {
                    finance = 'N';
                }
                var output = [];
                var currDate = date_picker.convertDateToString(new Date(), 'yyyy-mm-dd');
                angular.forEach($scope.sessionVariable.ten_days_followup.follow_up, function (item) {
                    var one = true;

                    if (currDate && (currDate != $scope.convertFormatOfDate(item['FOLLOW_DATE']))) {
                        one = false;
                    }//end if
                    if (one) {
                        output.push(item);
                    }

                });//end foreach


                $scope.arrayList.follow_up = output;
                $scope.dataRefreshing = false;
            } catch (err) {
                alert(err);
            }
        }//end filter
        
        
        
        
        $scope.convertFormatOfDate = function (date) {
            function padLeftZero(data) {
                if (('' + data).length < 2)
                    data = "0" + data;
                return data;
            }
            var retval = "";
            var month_names = new Array("jan", "feb", "mar",
                "apr", "may", "jun", "jul", "aug", "sep",
                "cct", "nov", "dec");

            var c = date.split("-");
            var check = new Date(('20' + c[2]), month_names.indexOf(c[1].toLowerCase()), c[0]);
            retval = check.getFullYear() + "-" + padLeftZero(check.getMonth() + 1) + "-" + padLeftZero(check.getDate());
            return retval;
        }
    });
