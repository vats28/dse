angular.module('starter.createEnquiry', [])

    .controller('createEnquiryCtrl', function ($scope, date_picker, generic_http_post_service) {


        $scope.sessionVariable.createEnquiry = {};// for create enquiry
        $scope.sessionVariable.temp_cont_enq.exp_purchase_date = '2016-03-10';

        $scope.veh_type_list = [
            {
                id: 1,
                type: "Two Wheeler",
            },
            {
                id: 2,
                type: "Four Wheeler",
            },
            {
                id: 3,
                type: "First Time Buyer",
            },
        ];

        $scope.selectedModel = '';
        $scope.pickDate = function (model) { //alert('d'); 
            $scope.selectedModel = model;
            date_picker.getDate('date', $scope.pickDate_callback);
        }
        $scope.pickDate_callback = function (data) {
            if ($scope.selectedModel == 'exp') {
                $scope.sessionVariable.temp_cont_enq.exp_purchase_date = data.currDate;
            } else if ($scope.selectedModel == 'fol') {
                $scope.sessionVariable.temp_cont_enq.fol_date = data.currDate;
            }
        }
        $scope.pickTime = function () { //alert('t');  
            date_picker.getDate('time', $scope.pickTime_callback);
        }
        $scope.pickTime_callback = function (data) {
            if ($scope.selectedModel == 'folTime') {
                $scope.data.folTime = data.currTime;
            }
        }

        $scope.getDateWithMonthName = function (dateString) {
            return date_picker.getDateWithMonthName(dateString);
        }

        $scope.getFolDateWithMonthName = function (dateString) {

            if (!dateString) {
                var nextDate = date_picker.addDays(new Date(), 1);
                dateString = date_picker.convertDateToString(nextDate, 'yyyy-mm-dd');
            } else {
                return;
            }
            $scope.sessionVariable.temp_cont_enq.fol_date = dateString;//date_picker.getDateWithMonthName(dateString);
        }

        $scope.saveTempEnquiry = function () {
            try {
                if (!$scope.sessionVariable.temp_cont_enq.model_interested) {
                    $scope.showAlertWindow_Titled('Error', 'Please select a model');
                    return;
                }
                //if(!$scope.sessionVariable.temp_cont_enq.exp_purchase_date){
                //    $scope.showAlertWindow_Titled('Error', 'Please select a date of purcahse ');
                //    return;
                //}
                if (!$scope.sessionVariable.temp_cont_enq.fol_date) {
                    $scope.showAlertWindow_Titled('Error', 'Please select a followup date');
                    return;
                }

                if (!$scope.sessionVariable.temp_cont_enq.existVeh) {
                    $scope.showAlertWindow_Titled('Error', 'Please select existing vehical type');
                    return;
                }

                if ($scope.sessionVariable.temp_cont_enq.existVeh == 1) {
                    // if (!$scope.sessionVariable.temp_cont_enq.existMake) {
                    //     $scope.showAlertWindow_Titled('Error', 'Please select make in dropdown');

                    //     return;
                    // }

                    // if (!$scope.sessionVariable.temp_cont_enq.existModel) {
                    //     $scope.showAlertWindow_Titled('Error', 'Please select model in dropdown');
                    //     return;
                    // }

                }
                //if(!$scope.sessionVariable.temp_cont_enq.fol_time){
                //    $scope.showAlertWindow_Titled('Error', 'Please select a followup time');
                //    return;
                //}

                //if(!$scope.sessionVariable.temp_cont_enq.fol_action){
                //    $scope.showAlertWindow_Titled('Error', 'Please select a followup action');
                //    return;
                //}

                // $scope.jumpTo('app.add_vehicle_info');
                
                $scope.showLoader("Please wait...");
                $scope.requestData = {};
                $scope.requestData = $scope.sessionVariable.temp_cont_enq;
                $scope.requestData.user_id = $scope.sessionVariable.username;
                //alert($scope.sessionVariable.login_data.state_id);
                $scope.requestData.state = $scope.getValueInJson($scope.sessionVariable.state_list, $scope.sessionVariable.login_data.state_id, "id", "state_name");//$scope.sessionVariable.state_list[$scope.sessionVariable.login_data.state_id];//.split(',')[1];
                $scope.requestData.district = $scope.getValueInJson($scope.sessionVariable.district_list, $scope.sessionVariable.login_data.district_id, "id", "district_name");//$scope.sessionVariable.district_list[$scope.sessionVariable.login_data.district_id];//.split(',')[1];
                $scope.requestData.tehsil = $scope.getValueInJson($scope.sessionVariable.tehsil_list, $scope.sessionVariable.login_data.tehsil_id, "id", "tehsil_name");//$scope.sessionVariable.tehsil_list[$scope.sessionVariable.login_data.tehsil_id];//.split(',')[1];
                $scope.requestData.village = $scope.getValueInJson($scope.sessionVariable.village_list, $scope.sessionVariable.login_data.village_id, "id", "village_name");//$scope.sessionVariable.village_list[$scope.sessionVariable.login_data.village_id];//.split(',')[1];
                $scope.requestData.exchange_req = $scope.sessionVariable.temp_cont_enq.exchange_req ? "Y" : "N";
                $scope.requestData.finance_req = $scope.sessionVariable.temp_cont_enq.finance_req ? "Y" : "N";
                $scope.requestData.existVeh = $scope.getValueInJson($scope.veh_type_list, $scope.sessionVariable.temp_cont_enq.existVeh, "id", "type");
                $scope.requestData.existMake = $scope.getValueInJson($scope.sessionVariable.make_list, $scope.sessionVariable.temp_cont_enq.existMake, "id", "make_name");

                var fol_d = $scope.sessionVariable.temp_cont_enq.fol_date;
                var exp_purchase_d = $scope.sessionVariable.temp_cont_enq.exp_purchase_date;
                $scope.requestData.fol_date = date_picker.getDateInFormat(fol_d, "mm/dd/yyyy");
                $scope.requestData.exp_purchase_date = date_picker.getDateInFormat(exp_purchase_d, "mm/dd/yyyy");


              //  alert($scope.sessionVariable.temp_cont_enq.fol_date);
                alert(JSON.stringify($scope.requestData));
                generic_http_post_service.getDetails_httpget(generic_http_post_service.getServices().SYNC_RECORDS,
                    $scope.requestData, $scope.saveTempEnquiry_callback);
            } catch (error) {
                alert(error);
                $scope.hideLoader();
            }
            //
        }

        $scope.saveTempEnquiry_callback = function (data) {
            $scope.hideLoader();
            //make it again in same format
            $scope.sessionVariable.temp_cont_enq.fol_date = "";
            $scope.sessionVariable.temp_cont_enq.exp_purchase_date = "";
            if (data.success == 1) {
                $scope.showAlertWindow_Titled('Success', 'Enquiry has been created successfully', $scope.after_saveTempVehicle);
            } else {
                $scope.showAlertWindow_Titled('Error', data.resDescription);
            }
        }

        $scope.after_saveTempVehicle = function () {
            $scope.sessionVariable.temp_cont_enq = {};
            $scope.disableBack();
            $scope.jumpTo('app.dashboard');
        }







    });
