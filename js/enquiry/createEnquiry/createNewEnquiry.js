angular.module('starter.createNewEnquiry', [])

    .controller('createNewEnquiryCtrl', function($scope, generic_http_post_service, date_picker) {

        $scope.sessionVariable.createEnquiry = {};// for create enquiry
        $scope.temp_cont_enq = {};
        //$scope.temp_cont_enq.exp_purchase_date = '2016-04-10';

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
        }//end 

        $scope.veh_type_list = [
            {
                id: 1,
                type: "Two Wheeler",
            },
            {
                id: 2,
                type: "Four wheeler",
            },
            {
                id: 3,
                type: "First Time Buyer",
            },
        ];



        $scope.selectedModel = '';
        $scope.pickDate = function(model) { //alert('d'); 
            $scope.selectedModel = model;
            date_picker.getDate('date', $scope.pickDate_callback, false);
        }
        $scope.pickDate_callback = function(data) {
            if ($scope.selectedModel == 'exp') {
                $scope.temp_cont_enq.exp_purchase_date = data.currDate;
            } else if ($scope.selectedModel == 'fol') {
                $scope.temp_cont_enq.fol_date = data.currDate;
            }
        }
        $scope.pickTime = function() { //alert('t');  
            date_picker.getDate('time', $scope.pickTime_callback);
        }
        $scope.pickTime_callback = function(data) {
            if ($scope.selectedModel == 'folTime') {
                $scope.data.folTime = data.currTime;
            }
        }

        $scope.getDateWithMonthName = function(dateString) {
            return date_picker.getDateWithMonthName(dateString);
        }

        $scope.getFolDateWithMonthName = function(dateString) {

            if (!dateString) {
                var nextDate = date_picker.addDays(new Date(), 1);
                dateString = date_picker.convertDateToString(nextDate, 'yyyy-mm-dd');
            } else {
                return;
            }
            $scope.temp_cont_enq.fol_date = dateString;//date_picker.getDateWithMonthName(dateString);
        }

        $scope.saveTempEnquiry = function() {
            try {
                if (!$scope.temp_cont_enq.model_interested) {
                    $scope.showAlertWindow_Titled('Error', 'Please select a model');
                    return;
                }
                if (!$scope.temp_cont_enq.fol_date) {
                    $scope.showAlertWindow_Titled('Error', 'Please select a followup date');
                    return;
                }

                if ($scope.temp_cont_enq.exp_purchase_date) {
                    var smaller = $scope.temp_cont_enq.fol_date;
                    var bigger = $scope.temp_cont_enq.exp_purchase_date;
                    if (date_picker.isGreaterDate(smaller, bigger) == 2) {//2 means not smaller but greater 1 smaller 3 equal
                        $scope.showAlertWindow_Titled('Error', 'Followup date should be smaller then expected purchase date');
                        return;
                    }
                }

                if (!$scope.temp_cont_enq.existVeh) {
                    $scope.showAlertWindow_Titled('Error', 'Please select existing vehical type');
                    return;
                }

                if ($scope.temp_cont_enq.existVeh == 1) {
                }
                $scope.showLoader("Please wait...");
                $scope.requestData = {};
                $scope.requestData = $scope.temp_cont_enq;
                $scope.requestData.user_id = $scope.sessionVariable.username;
                //alert($scope.sessionVariable.login_data.state_id);

                $scope.requestData.fname = $scope.sessionVariable.contact_list.selected_item.FST_NAME;
                $scope.requestData.lname = $scope.sessionVariable.contact_list.selected_item.LAST_NAME;
                $scope.requestData.mobile = $scope.sessionVariable.contact_list.selected_item.CELL_PH_NUM;
                $scope.requestData.gender = $scope.sessionVariable.contact_list.selected_item.GENDER;
                $scope.requestData.age = $scope.sessionVariable.contact_list.selected_item.AGE;
                if ($scope.sessionVariable.contact_list.selected_item.ADDR)
                    $scope.requestData.address1 = $scope.sessionVariable.contact_list.selected_item.ADDR;
                $scope.requestData.state = $scope.sessionVariable.contact_list.selected_item.STATE;
                $scope.requestData.district = $scope.sessionVariable.contact_list.selected_item.DISTRICT;
                $scope.requestData.tehsil = $scope.sessionVariable.contact_list.selected_item.TEHSIL;
                $scope.requestData.village = $scope.sessionVariable.contact_list.selected_item.CITY;
                $scope.requestData.exchange_req = $scope.temp_cont_enq.exchange_req ? "Y" : "N";
                $scope.requestData.finance_req = $scope.temp_cont_enq.finance_req ? "Y" : "N";
                $scope.requestData.existVeh = $scope.getValueInJson($scope.veh_type_list, $scope.temp_cont_enq.existVeh, "id", "type");
                $scope.requestData.existMake = $scope.getValueInJson($scope.sessionVariable.make_list, $scope.temp_cont_enq.existMake, "id", "make_name");

                var fol_d = $scope.temp_cont_enq.fol_date;
                var exp_purchase_d = $scope.temp_cont_enq.exp_purchase_date;
                $scope.requestData.fol_date = date_picker.getDateInFormat(fol_d, "mm/dd/yyyy");
                $scope.requestData.exp_purchase_date = date_picker.getDateInFormat(exp_purchase_d, "mm/dd/yyyy");
                $scope.requestData.dealer_code = $scope.sessionVariable.login_data.dealer_code;


                //  alert($scope.temp_cont_enq.fol_date);
                console.log(JSON.stringify($scope.requestData));
                generic_http_post_service.getDetails(generic_http_post_service.getServices().SYNC_RECORDS,
                    $scope.requestData, $scope.saveTempEnquiry_callback);
            } catch (error) {
                alert(error);
                $scope.hideLoader();
            }
            //
        }

        $scope.saveTempEnquiry_callback = function(data) {
            $scope.hideLoader();
            //make it again in same format
            $scope.temp_cont_enq.fol_date = "";
            $scope.temp_cont_enq.exp_purchase_date = "";
            if (data.success == 1) {
                $scope.showAlertWindow_Titled('Success', 'Enquiry has been created successfully', $scope.after_saveTempVehicle);
                $scope.closeModal();
            } else {
                $scope.showAlertWindow_Titled('Error', data.resDescription);
            }
        }

        $scope.after_saveTempVehicle = function() {
            $scope.temp_cont_enq = {};
            $scope.disableBack();
            $scope.jumpTo('app.dashboard');
        }





    });
