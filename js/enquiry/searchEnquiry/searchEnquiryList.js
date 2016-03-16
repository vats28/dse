
angular.module('starter.searchEnquiryList', [])

    .controller('searchEnquiryListCtrl', function ($scope, $ionicPopup, $timeout, generic_http_post_service, date_picker) {

        $scope.arrayList = {};

        

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
            } catch (error) {
                //alert(error);
            }
            /* 
             ten_days_followup = {"follow_up":[{"FST_NAME":"ROBIN","LAST_NAME":"KAPOOR","CELL_PH_NUM":"9818306660",
         "AGE":"30","GENDER":"M","EMAIL_ADDR":"","STATE":"HARYANA","DISTRICT":"GURGAON","TEHSIL":"GURGAON",
         "CITY":"AKLIMPUR","X_CON_SEQ_NUM":"10691-01-SCON-0316-19517","X_MODEL_INTERESTED":"HF DELUXE ECO",
         "EXPCTD_DT_PURCHASE":"05-MAR-16","X_EXCHANGE_REQUIRED":"N","X_FINANCE_REQUIRED":"N","EXISTING_VEHICLE":"Four wheeler",
         "FOLLOWUP_COMMENTS":"","ENQUIRY_ID":"1-78BSCKV","follow_date":"03-MAR-16"},{"FST_NAME":"LADOO",
         "LAST_NAME":"SINGH","CELL_PH_NUM":"5555555555","AGE":"55","GENDER":"M","EMAIL_ADDR":"","STATE":"DELHI",
         "DISTRICT":"EAST DELHI","TEHSIL":"GANDHI NAGAR","CITY":"DMC","X_CON_SEQ_NUM":"10691-01-SCON-0316-19520",
         "X_MODEL_INTERESTED":"CD DAWN","EXPCTD_DT_PURCHASE":"09-MAR-16","X_EXCHANGE_REQUIRED":"N","X_FINANCE_REQUIRED":"N",
         "EXISTING_VEHICLE":"First Time Buyer","FOLLOWUP_COMMENTS":"","ENQUIRY_ID":"1-78BST7B","follow_date":"03-MAR-16"}],
         "success":1,"date":"03/11/2016"};
         */
            try {
                //if its already available dont
                if (ten_days_followup) {
                    $scope.sessionVariable.ten_days_followup = ten_days_followup;
                    if (!$scope.matchDate()) {
                        $scope.Fetch_10_days_Enquiry();
                    } else {
                        $scope.filterFollowups();
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
            var retval = false;
            try {
                if ($scope.sessionVariable.ten_days_followup.date) {
                    var currDate = date_picker.convertDateToString(new Date(), "mm/dd/yyyy");
                    if (currDate == $scope.sessionVariable.ten_days_followup.date) {
                        retval = true;
                    }//end inner if
                }
            } catch (error) {
                alert(error);
            }
            return retval;
        }

        $scope.Fetch_10_days_Enquiry_callback = function (data) {
            $scope.dataRefreshing = false;
            if (data.success == 1) {
                $scope.SaveInLocalStorage($scope.localStorageKeys.TEN_DAY_FOLLOW, JSON.stringify(data));
                $scope.sessionVariable.ten_days_followup = data;
                $scope.filterFollowups();

            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }

        $scope.applyfilterFollowups = function () {
            $scope.goBackScreen();
            $scope.jumpTo('app.searchEnquiryList');
        }

        $scope.filterFollowups = function () {

            var finance = undefined;
            if ($scope.search_filter.finance == 2) {
                finance = 'Y';
            } else if ($scope.search_filter.finance == 3) {
                finance = 'N';
            }
            var output = [];
            angular.forEach($scope.sessionVariable.ten_days_followup.follow_up, function (item) {
                var isMember = false;
                var one = true, two = true, three = true, four = true, five = true;

                if ($scope.search_filter.NXT && $scope.search_filter.IsNextDate && ($scope.search_filter.NXT != $scope.convertFormatOfDate(item['follow_date']))) {
                    one = false;
                }//end if
                if ($scope.search_filter.EXP_FROM && $scope.search_filter.EXP_TO && $scope.search_filter.IsExpDate
                    && !$scope.dateInRange($scope.search_filter.EXP_FROM,
                        $scope.search_filter.EXP_TO, item['EXPCTD_DT_PURCHASE'].toLowerCase())) {
                    two = false;
                }//end if
                if ($scope.search_filter.MODEL && ($scope.search_filter.MODEL.toLowerCase() != item['X_MODEL_INTERESTED'].toLowerCase())) {
                    four = false;
                }//end if
                if (finance && (finance.toLowerCase() != item['X_FINANCE_REQUIRED'].toLowerCase())) {
                    five = false;
                }//end if
                
                if (one && two && three && four && five) {
                    output.push(item);
                }
                
                // if ($scope.search_filter.CRT_FROM && $scope.search_filter.CRT_TO
                //     && !$scope.dateInRange($scope.search_filter.CRT_FROM, $scope.search_filter.CRT_TO)) {
                //     three = false;
                // }//end if
            });//end foreach


            $scope.arrayList.follow_up = output;
            $scope.dataRefreshing = false;
        }//end filter
        
        
        $scope.dateInRange = function (startDate, endDate, dateCheck) {
            var month_names = new Array("jan", "feb", "mar",
                "apr", "may", "jun", "jul", "aug", "sep",
                "cct", "nov", "dec");

            var retval = false;
            // var dateFrom = "02/05/2013";
            // var dateTo = "02/09/2013";
            //var dateCheck = "02/07/2013";//follow_date":"03-MAR-16"
            try {
                var d1 = startDate.split("-");
                var d2 = endDate.split("-");

                var c = dateCheck.split("-");

                var from = new Date(d1[0], d1[1] - 1, d1[2]);// y,m,d // -1 because months are from 0 to 11
                var to = new Date(d2[0], d2[1] - 1, d2[2]);
                
                //now decrease a day from - from date and increase a day in to
                from  = date_picker.addDays(from, -1);
                to  = date_picker.addDays(to, 1);
                
                var check = new Date(('20' + c[2]), month_names.indexOf(c[1].toLowerCase()), c[0]);
                //alert('check ' + check + '<br/>' + 'from ' + from + '<br/>' + 'to ' + to + '<br/>')
                if (check > from && check < to) {
                    //alert("here");
                    retval = true;
                }
            } catch (error) {

            }

            return retval;
        }//end
        
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


        $scope.clear_filter = function () {
            $scope.showConfirm('Are you sure', 'Do you really want to clear filter from search list?', $scope.clear_filter_callback);
            
        }//ned clear_filter
        
        $scope.clear_filter_callback = function(){
            $scope.search_filter = {};
            $scope.search_filter.finance = 1;
            $scope.filterFollowups();
        }

    });
