angular.module('starter.closeEnquiryModal', [])

    .controller('closeEnquiryModalCtrl', function($scope, $rootScope, generic_http_post_service) {
        $scope.data = {};

        //$scope.GetInLocalStorage('Dealer')
        $scope.init = function() {
            // get make model
            var make_model_data = null;
            try {
                make_model_data = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.MAKE_MODEL));
                // alert(JSON.stringify(make_model_data));

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


        $scope.mainReason = [
            "Others",
            "Purchased from Own Dealership",
            "Dropped the Idea",
            "Purchased From Competition",
            "Purchased From CoDealer",
        ];

        $scope.subReason = {
            "Others": [

                { value: "Finance not available" },
                { value: "SKU Non-Availability" },
                { value: "Secondhand Purchase" },
                { value: "Others" },
                { value: "Exchange price not suitable" },
                { value: "Wrong Contact Number" },
            ],
            "Purchased From CoDealer": [
                { value: "Better Finance" },
                { value: "Discount" },
                { value: "Better exchange value" },
                { value: "Proximity" },
                { value: "Others" },
                { value: "SKU Non-Availability" },
            ],
            "Purchased From Competition": [
                { value: "Proximity" },
                { value: "SKU Non-Availability" },
                { value: "First preference" },
                { value: "Better Finance" },
                { value: "Others" },
                { value: "Discount" },
                { value: "Better exchange value" },
            ],
        };



        $scope.onMainReasonSelect = function(value) {

        }

        // Punardeep Singh (punardeep.singh@heromotocorp.com)
        // $user_id = $_REQUEST['user_id']?$_REQUEST['user_id']:"";
        // $dms_enquiry_id = $_REQUEST['dms_enquiry_id']?$_REQUEST['dms_enquiry_id']:"";

        // $fol_date = $_REQUEST['fol_date']?$_REQUEST['fol_date']:"";
        // $model_interested = $_REQUEST['model_interested']?$_REQUEST['model_interested']:"";

        // $remarks = $_REQUEST['remarks']?$_REQUEST['remarks']:"";
        // $reason = $_REQUEST['reason']?$_REQUEST['reason']:"";
        // $sub_reason = $_REQUEST['sub_reason']?$_REQUEST['sub_reason']:"";

        // $existing_make = $_REQUEST['existMake']?$_REQUEST['existMake']:"";
        // $existing_model= $_REQUEST['existModel']?$_REQUEST['existModel']:"";

        $scope.closeEnquiry = function() {
            if (!$scope.data.reason) {
                $scope.showAlertWindow("Please select main reason");
                return;
            }
            if (($scope.data.reason == "Others" || $scope.data.reason == "Purchased From CoDealer" ||
                $scope.data.reason == "Purchased From Competition") && !$scope.data.sub_reason) {

                $scope.showAlertWindow("Please select sub reason");
                return;
            }
            // if (!$scope.data.remarks) {
            //     $scope.showAlertWindow("Please enter remark");
            //     return;
            // }
            // if (!$scope.data.existMake) {
            //     $scope.showAlertWindow("Please select a make");
            //     return;
            // }
            // if (!$scope.data.existModel) {
            //     $scope.showAlertWindow("Please select a model");
            //     return;
            // }
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData = $scope.data;
            $scope.requestData.user_id = $scope.sessionVariable.username;
            $scope.requestData.dms_enquiry_id = $scope.sessionVariable.selected_enquiry.ENQUIRY_ID;
            if ($scope.data.existMake)
                $scope.requestData.existMake = $scope.data.existMake.split(',')[1];//$scope.getValueInJson($scope.sessionVariable.make_list, $scope.data.existMake, "id", "make_name");

            generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().SYNC_FOLLOW_UP,
                $scope.requestData, $scope.closeEnquiry_callback);
        }

        $scope.closeEnquiry_callback = function(data) {
            $scope.hideLoader();
            //alert(JSON.stringify(data));
            if (data.success == 1) {
                $scope.showAlertWindow_Titled("Success", "Enquiry closed");
                //so if success then remove this enquiry from local db
                $scope.removeLocalEnquiry();
                $scope.closeModal();
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }

        $scope.removeLocalEnquiry = function() {
            var keepGoing = true;
            var index = 0;
            try {
                if ($scope.sessionVariable.ten_days_followup) {
                    angular.forEach($scope.sessionVariable.ten_days_followup.follow_up, function(value, key) {

                        if (keepGoing) {
                            if (value['ENQUIRY_ID'] == $scope.sessionVariable.selected_enquiry.ENQUIRY_ID) {
                                $scope.sessionVariable.ten_days_followup.follow_up.splice(index, 1);
                                $scope.SaveInLocalStorage($scope.localStorageKeys.TEN_DAY_FOLLOW,
                                    JSON.stringify($scope.sessionVariable.ten_days_followup));

                                $rootScope.$broadcast('filterFollowups', 'close');
                                keepGoing = false;
                            }
                            index++;
                        }
                    });
                }

                if (keepGoing) { //means not found in above array
                    //alert("here");
                    index = 0;
                    angular.forEach($scope.sessionVariable.contact_list.enquiry, function(value, key) {

                        if (keepGoing) {
                            if (value['ENQUIRY_ID'] == $scope.sessionVariable.selected_enquiry.ENQUIRY_ID) {
                                // alert(value['ENQUIRY_ID']);
                                // alert(JSON.stringify($scope.sessionVariable.contact_list.enquiry));
                                $scope.sessionVariable.contact_list.enquiry.splice(index, 1);
                                $rootScope.$broadcast('filterFollowups', 'close');

                                //alert(JSON.stringify($scope.sessionVariable.contact_list.enquiry));
                                keepGoing = false; //in this more the one query is returning with same id which is wrong

                            }
                            index++;
                        }
                    });
                }

            } catch (error) {
                alert(error);
            }

        }//end


    });
