angular.module('starter.followupEnquiryModal', [])

    .controller('followupEnquiryModalCtrl', function ($scope, generic_http_post_service, date_picker) {
        $scope.page = {};
        $scope.init = function () {

        }

        $scope.pickDate = function () { //alert('d'); 
            date_picker.getDate('date', $scope.pickDate_callback);
        }
        $scope.pickDate_callback = function (data) {
            $scope.page.date = data.currDate;
        }

        $scope.getDateWithMonthName = function (dateString) {
            return date_picker.getDateWithMonthName(dateString);
        }

        $scope.getFolDateWithMonthName = function (dateString) {

            if (!dateString) {
                var nextDate = date_picker.addDays(new Date(), 1);
                // alert(nextDate);
                dateString = date_picker.convertDateToString(nextDate, 'yyyy-mm-dd');
               // alert(dateString);
            } else {
                return;
            }
            $scope.page.date = dateString;//date_picker.getDateWithMonthName(dateString);
        }

        $scope.followupEnquiry = function () {
            // if (!$scope.page.remarks) {
            //     $scope.showAlertWindow("Please enter followup action");
            //     return;
            // }
            if (!$scope.page.date) {
                $scope.showAlertWindow("Please select date");
                return;
            }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData = $scope.page;
            $scope.requestData.user_id = $scope.sessionVariable.username;
            $scope.requestData.dms_enquiry_id = $scope.sessionVariable.selected_enquiry.ENQUIRY_ID;
            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().SYNC_FOLLOW_UP,
                $scope.requestData, $scope.followupEnquiry_callback);
        }

        $scope.followupEnquiry_callback = function (data) {
            $scope.hideLoader();
            if (data.success == 1) {
                $scope.showAlertWindow_Titled("Success", "Next followup scheduled");
                //change next followup date in local db
                $scope.updateEnquiry();
                $scope.closeModal();
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }
        
        
        $scope.updateEnquiry = function () {
            var keepGoing = true;
            var index = 0;
            angular.forEach($scope.sessionVariable.ten_days_followup.follow_up, function (value, key) {

                if (keepGoing) {
                    if (value['ENQUIRY_ID'] == $scope.sessionVariable.selected_enquiry.ENQUIRY_ID) {
                        $scope.sessionVariable.ten_days_followup.follow_up[index].follow_date = $scope.convertFormatOfDate($scope.page.date);
                        $scope.sessionVariable.ten_days_followup.follow_up[index].FOLLOWUP_COMMENTS = $scope.page.remarks;
                        $scope.SaveInLocalStorage($scope.localStorageKeys.TEN_DAY_FOLLOW, 
                                                        JSON.stringify($scope.sessionVariable.ten_days_followup));
                        keepGoing = false;
                    }
                    index++;
                }
            });
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
            var check = new Date(c[0], c[1], c[2]);
            retval = padLeftZero(check.getDate()) + "-" + month_names[check.getMonth()-1] + "-" + check.getFullYear().toString();
            return retval;
        }


    });
