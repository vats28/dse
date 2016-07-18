
angular.module('starter.editEnquiry', [])

    .controller('editEnquiryCtrl', function ($scope, $timeout, date_picker, form_validator, generic_http_post_service) {

        $scope.previous_selectedModel = "";
        $scope.disableCase = {
            ONE: true, // means fname , lname , mobile will remain disabled
            TWO: false
        };
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

        $scope.onTab1_click = function () {
            if (!$scope.tabs_validation())
                return;
            $scope.tab1 = true;
            $scope.tab2 = false;
            $scope.tab3 = false;
        }//edn
        $scope.onTab2_click = function () {
            if (!$scope.tabs_validation())
                return;
            $scope.tab1 = false;
            $scope.tab2 = true;
            $scope.tab3 = false;
        }//edn
        $scope.onTab3_click = function () {
            if (!$scope.tabs_validation())
                return;
            $scope.tab1 = false;
            $scope.tab2 = false;
            $scope.tab3 = true;
        }//edn

        $scope.tabs_validation = function () {
            if ($scope.tab1) {
                return $scope.tab1_validation();
            }
            else if ($scope.tab2) {
                return $scope.tab2_validation();
            }
            else if ($scope.tab3) {
                return $scope.tab3_validation();
            }
        }

        $scope.tab1_validation = function () {
            if ($scope.sessionVariable.temp_cont_enq.EMAIL_ADDR) {
                if (!form_validator.IsValidEmail($scope.sessionVariable.temp_cont_enq.EMAIL_ADDR)) {
                    $scope.showAlertWindow_Titled('Error', 'Please enter valid email address');
                    return false;
                }
            }
            if (!$scope.sessionVariable.temp_cont_enq.AGE) {
                $scope.showAlertWindow_Titled('Error', 'Please enter age');
                return false;
            }
            if (!$scope.sessionVariable.temp_cont_enq.GENDER) {
                $scope.showAlertWindow_Titled('Error', 'Please select gender');
                return false;
            }

            return true;
        }//end

        $scope.tab2_validation = function () {
            if ($scope.disableCase.TWO) {
                if (!$scope.sessionVariable.temp_cont_enq.state_id) {
                    $scope.showAlertWindow_Titled('Error', 'Please select state');
                    return false;
                }
                if (!$scope.sessionVariable.temp_cont_enq.district_id) {
                    $scope.showAlertWindow_Titled('Error', 'Please select district');
                    return false;
                }
                if (!$scope.sessionVariable.temp_cont_enq.tehsil_id) {
                    $scope.showAlertWindow_Titled('Error', 'Please select tehsil');
                    return false;
                }
                if (!$scope.sessionVariable.temp_cont_enq.village_id) {
                    $scope.showAlertWindow_Titled('Error', 'Please select village');
                    return false;
                }
            }

            return true;
        }//end

        $scope.tab3_validation = function () {
            if (!$scope.sessionVariable.temp_cont_enq.X_MODEL_INTERESTED) {
                $scope.showAlertWindow_Titled('Error', 'Please select a model');
                return false;
            }
            if (!$scope.sessionVariable.temp_cont_enq.FOLLOW_DATE) {
                $scope.showAlertWindow_Titled('Error', 'Please select a followup date');
                return false;
            }

            if (!$scope.sessionVariable.temp_cont_enq.existVeh) {
                $scope.showAlertWindow_Titled('Error', 'Please select existing vehical type');
                return false;
            }

            if ($scope.sessionVariable.temp_cont_enq.EXPCTD_DT_PURCHASE) {
                var smaller = $scope.sessionVariable.temp_cont_enq.FOLLOW_DATE;
                var bigger = $scope.sessionVariable.temp_cont_enq.EXPCTD_DT_PURCHASE;
                if (date_picker.isGreaterDate(smaller, bigger) == 2) {//2 means not smaller but greater 1 smaller 3 equal
                    $scope.showAlertWindow_Titled('Error', 'Followup date should be smaller then expected purchase date');
                    return false;
                }
            }
            return true;
        }//end

        $scope.toggleAddressEdit = function () {
            if ($scope.disableCase.TWO) {
                $scope.getStateList();
            }
        }//

        $scope.isExisitingEnquiry = false;
        $scope.init = function () {
            //$scope.sessionVariable.enquiryError = false;
            $scope.previous_selectedModel = $scope.sessionVariable.temp_cont_enq.X_MODEL_INTERESTED;
            if ($scope.sessionVariable.createNewEnquiry) {
                $scope.tab3 = true;
                $scope.sessionVariable.createNewEnquiry = false;
                $scope.isExisitingEnquiry = true;
            } else {

                $scope.tab1 = true;
            }
            $scope.init_part2();

        }//end init

        $scope.init_part2 = function () {
            $scope.sessionVariable.temp_cont_enq = {};
            // $scope.sessionVariable.selected_enquiry_edit = {
            //      "FST_NAME":"DEEPANSHU.","LAST_NAME":"SINGH",
            //  "CELL_PH_NUM":"9555714567","AGE":"25",
            // "GENDER":"M","EMAIL_ADDR":"a@a.co","STATE":"RAJASTHAN","DISTRICT":"BHILWARA",
            // "TEHSIL":"JAHAZPUR","CITY":"AMALDA","X_CON_SEQ_NUM":"10866-01-SCON-0516-10728",
            // "X_MODEL_INTERESTED":"XTREME","EXPCTD_DT_PURCHASE":"06-MAY-16",
            // "X_EXCHANGE_REQUIRED":"N","X_FINANCE_REQUIRED":"Y",
            // "EXISTING_VEHICLE":"Two Wheeler","MAKE_CD":"BAJAJ","MODEL_CD":"DISCOVER 125",
            // "FOLLOWUP_COMMENTS":null,"ENQUIRY_ID":"1-78DQP6K","X_TEST_RIDE_REQ":"Y",
            // "ENQUIRY_ENTRY_DATE":"03-MAY-16","FOLLOW_DATE":"04-MAY-16","$$hashKey":"object:49"};
            $scope.sessionVariable.selected_enquiry_edit.EXPCTD_DT_PURCHASE = $scope.changeDateFormat($scope.sessionVariable.selected_enquiry_edit.EXPCTD_DT_PURCHASE);
            $scope.sessionVariable.selected_enquiry_edit.FOLLOW_DATE = $scope.changeDateFormat($scope.sessionVariable.selected_enquiry_edit.FOLLOW_DATE);
            $scope.sessionVariable.temp_cont_enq = $scope.sessionVariable.selected_enquiry_edit;
            $scope.sessionVariable.temp_cont_enq.AGE = parseInt($scope.sessionVariable.selected_enquiry_edit.AGE);
            $scope.sessionVariable.temp_cont_enq.exchange_req = $scope.sessionVariable.temp_cont_enq.X_EXCHANGE_REQUIRED == 'Y' ? true : false;
            $scope.sessionVariable.temp_cont_enq.finance_req = $scope.sessionVariable.temp_cont_enq.X_FINANCE_REQUIRED == 'Y' ? true : false;
            $scope.sessionVariable.temp_cont_enq.test_ride = $scope.sessionVariable.temp_cont_enq.X_TEST_RIDE_REQ == 'Y' ? true : false;
            $scope.getMakeModel();
        }//end



        $scope.getStateList = function () {
            var stateData = null;
            try {
                stateData = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.STATE));
            } catch (error) {
                console.log("stateData master not found  " + error);
            }
            if (stateData) {
                $scope.sessionVariable.temp_cont_enq.state_list = stateData.state;
                $scope.setState();
            } else {
                $scope.showAlertWindow_Titled("Error", "State master not available");
            }
        }//end 



        $scope.setState = function () {
            $scope.sessionVariable.temp_cont_enq.state_id = $scope.getValueInJson(
                $scope.sessionVariable.temp_cont_enq.state_list,
                $scope.sessionVariable.temp_cont_enq.STATE,
                "state_name", "id"
            );
            $scope.get_district($scope.sessionVariable.temp_cont_enq.state_id, $scope.get_district_callback);
        }

        $scope.get_district_callback = function (data) {

            $scope.hideLoader();
            if (data.success == "true") {
                $scope.sessionVariable.temp_cont_enq.district_list = data.district;
                $scope.setDistrict();
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }

        $scope.setDistrict = function () {
            $scope.sessionVariable.temp_cont_enq.district_id = $scope.getValueInJson(
                $scope.sessionVariable.temp_cont_enq.district_list,
                $scope.sessionVariable.temp_cont_enq.DISTRICT,
                "district_name", "id"
            );
            if ($scope.sessionVariable.temp_cont_enq.district_id)
                $scope.get_full_district_data($scope.sessionVariable.temp_cont_enq.district_id, $scope.get_full_district_data_callback);
        }

        $scope.get_full_district_data_callback = function (data) {
            $scope.hideLoader();
            if (data.result != []) {
                $scope.sessionVariable.temp_cont_enq.tehsil_list = data.tehsil;
                $scope.sessionVariable.temp_cont_enq.village_list = data.village;
                $scope.setTehsil();
                $scope.setCity();
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }


        $scope.setTehsil = function () {
            $scope.sessionVariable.temp_cont_enq.tehsil_id = $scope.getValueInJson(
                $scope.sessionVariable.temp_cont_enq.tehsil_list,
                $scope.sessionVariable.temp_cont_enq.TEHSIL,
                "tehsil_name", "id"
            );
        }

        $scope.setCity = function () {
            $scope.sessionVariable.temp_cont_enq.village_id = $scope.getValueInJson(
                $scope.sessionVariable.temp_cont_enq.village_list,
                $scope.sessionVariable.temp_cont_enq.CITY,
                "village_name", "id"
            );
        }




        $scope.onStateChange = function () {    //clear earlier data
            $scope.showConfirm('Are you sure', 'Do you really want to change your district?', null, $scope.onStateChange_callback);

        }

        $scope.onStateChange_callback = function () {
            //clear variables
            $scope.sessionVariable.temp_cont_enq.district_id = "";
            $scope.sessionVariable.temp_cont_enq.tehsil_id = "";
            $scope.sessionVariable.temp_cont_enq.village_id = "";
            // fetch new districts  
            $scope.get_district($scope.sessionVariable.temp_cont_enq.state_id, $scope.get_district_callback);
        }

        $scope.onDistrictChange = function () {
            //clear earlier data
            $scope.showConfirm('Are you sure', 'Do you really want to change your district?', null, $scope.onDistrictChange_callback);
        }

        $scope.onDistrictChange_callback = function () {
            //clear variables
            $scope.sessionVariable.temp_cont_enq.tehsil_id = "";
            $scope.sessionVariable.temp_cont_enq.village_id = "";
            // fetch new districts
            $scope.get_full_district_data($scope.sessionVariable.temp_cont_enq.district_id, $scope.get_full_district_data_callback);
        }



        $scope.onTehsilChange = function () {

            //clear variables
            $scope.sessionVariable.temp_cont_enq.village_id = "";
        }




        $scope.getMakeModel = function () {
            var make_model_data = null;
            try {
                make_model_data = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.MAKE_MODEL));
                //if its already available dont
                if (make_model_data) {
                    $scope.sessionVariable.temp_cont_enq.make_list = make_model_data.make;
                    $scope.sessionVariable.temp_cont_enq.model_list = make_model_data.model;
                    $scope.sessionVariable.temp_cont_enq.model_interested = make_model_data.model_interested;
                    $scope.setExistingVehicle();
                } else {
                    //$scope.get_make_model();
                    $scope.showAlertWindow_Titled("Error", "No data not found for make and model");
                }

            } catch (error) {
                console.log("make model not found  " + error);
                alert(error);
            }
        }//end 

        $scope.setExistingVehicle = function () {
            $scope.sessionVariable.temp_cont_enq.existVeh = $scope.getValueInJson(
                $scope.veh_type_list,
                $scope.sessionVariable.selected_enquiry_edit.EXISTING_VEHICLE,
                "type", "id"
            );
            $scope.setExistingMake();
        }
        $scope.setExistingMake = function () {
            $scope.sessionVariable.temp_cont_enq.existMake = $scope.getValueInJson(
                $scope.sessionVariable.temp_cont_enq.make_list,
                $scope.sessionVariable.selected_enquiry_edit.MAKE_CD,
                "make_name", "id"
            );
            $scope.setExistingModel();
        }

        $scope.setExistingModel = function () {
            $scope.sessionVariable.temp_cont_enq.existModel = $scope.sessionVariable.selected_enquiry_edit.MODEL_CD;
        }

        $scope.onExistVeh_Change = function () {
            $scope.sessionVariable.temp_cont_enq.existMake = "";
            $scope.sessionVariable.temp_cont_enq.existModel = "";
        }
        $scope.onExistMake_Change = function () {
            $scope.sessionVariable.temp_cont_enq.existModel = "";
        }


        $scope.selectedModel = '';
        $scope.pickDate = function (model) { //alert('d'); 
            $scope.selectedModel = model;
            date_picker.getDate('date', $scope.pickDate_callback, false);
        }
        $scope.pickDate_callback = function (data) {
            if ($scope.selectedModel == 'exp') {
                $scope.sessionVariable.temp_cont_enq.EXPCTD_DT_PURCHASE = data.currDate;
            } else if ($scope.selectedModel == 'fol') {
                $scope.sessionVariable.temp_cont_enq.FOLLOW_DATE = data.currDate;
            }
        }

        $scope.getDateWithMonthName = function (dateString) {
            if (!dateString) {
                return;
            }
            var format = 'dd-mmm-yy';
            return date_picker.getDateWithMonthName(dateString, format);
        }

        $scope.getFolDateWithMonthName = function (dateString) {

            if (!dateString) {
                var nextDate = date_picker.addDays(new Date(), 1);
                dateString = date_picker.convertDateToString(nextDate, 'yyyy-mm-dd');
            } else {
                return;
            }
            $scope.sessionVariable.temp_cont_enq.FOLLOW_DATE = dateString;//date_picker.getDateWithMonthName(dateString);
        }

        $scope.changeDateFormat = function (dateString) {
            if (!dateString)
                return;
            var month_names = new Array("jan", "feb", "mar",
                "apr", "may", "jun", "jul", "aug", "sep",
                "oct", "nov", "dec");

            var arr = dateString.split('-');
            dateString = '20' + arr[2] + '-' + padLeftZero(month_names.indexOf(arr[1].toLowerCase()) + 1) + '-' + padLeftZero(arr[0]);
            return dateString;
        }//edn


        $scope.saveTempEnquiry = function () {
            try {
                if (!$scope.tab1_validation() || !$scope.tab2_validation() || !$scope.tab3_validation()) {
                    return;
                }

                $scope.showLoader("Please wait...");
                $scope.requestData = {};
                //$scope.requestData = $scope.sessionVariable.temp_cont_enq;

                // {"mobile":"3768623623","email":"dbc@hsdbch.com","fname":"sdcsd",
                // "lname":"sdcsd","age":12,"gender":"M","address1":"dc",
                // "address2":"dc","pincode":"dc","fol_date":"05/14/2016",
                // "model_interested":"GLAMOUR","finance_req":"Y","test_ride":"Y",
                // "remarks":"sdc","existVeh":"Two Wheeler","existMake":"BAJAJ",
                // "existModel":"PULSAR","user_id":"10866S20","state":"HARYANA",
                // "district":"BHIWANI","tehsil":"BAWANI KHERA","village":"LOHARI JATU",
                // "exchange_req":"N","exp_purchase_date":"","dealer_code":"10866"}


                $scope.requestData.mobile = $scope.sessionVariable.temp_cont_enq.CELL_PH_NUM;
                $scope.requestData.email = $scope.sessionVariable.temp_cont_enq.EMAIL_ADDR;
                $scope.requestData.fname = $scope.sessionVariable.temp_cont_enq.FST_NAME;
                $scope.requestData.lname = $scope.sessionVariable.temp_cont_enq.LAST_NAME;
                $scope.requestData.age = $scope.sessionVariable.temp_cont_enq.AGE;
                $scope.requestData.gender = $scope.sessionVariable.temp_cont_enq.GENDER;
                $scope.requestData.address1 = $scope.sessionVariable.temp_cont_enq.ADDR;
                $scope.requestData.address2 = $scope.sessionVariable.temp_cont_enq.ADDR_LINE_2;
                $scope.requestData.pincode = $scope.sessionVariable.temp_cont_enq.pincode;
                if ($scope.sessionVariable.selected_enquiry_edit.ENQUIRY_ID)
                    $scope.requestData.exist_enq_id = $scope.sessionVariable.selected_enquiry_edit.ENQUIRY_ID;

                $scope.requestData.user_id = $scope.sessionVariable.username;
                if (!$scope.disableCase.TWO) {
                    $scope.requestData.state = $scope.sessionVariable.selected_enquiry_edit.STATE;
                    $scope.requestData.district = $scope.sessionVariable.selected_enquiry_edit.DISTRICT;
                    $scope.requestData.tehsil = $scope.sessionVariable.selected_enquiry_edit.TEHSIL;
                    $scope.requestData.village = $scope.sessionVariable.selected_enquiry_edit.CITY;
                } else {
                    $scope.requestData.state = $scope.getValueInJson($scope.sessionVariable.temp_cont_enq.state_list, $scope.sessionVariable.temp_cont_enq.state_id, "id", "state_name");//$scope.sessionVariable.state_list[$scope.sessionVariable.login_data.state_id];//.split(',')[1];
                    $scope.requestData.district = $scope.getValueInJson($scope.sessionVariable.temp_cont_enq.district_list, $scope.sessionVariable.temp_cont_enq.district_id, "id", "district_name");//$scope.sessionVariable.district_list[$scope.sessionVariable.login_data.district_id];//.split(',')[1];
                    $scope.requestData.tehsil = $scope.getValueInJson($scope.sessionVariable.temp_cont_enq.tehsil_list, $scope.sessionVariable.temp_cont_enq.tehsil_id, "id", "tehsil_name");//$scope.sessionVariable.tehsil_list[$scope.sessionVariable.login_data.tehsil_id];//.split(',')[1];
                    $scope.requestData.village = $scope.getValueInJson($scope.sessionVariable.temp_cont_enq.village_list, $scope.sessionVariable.temp_cont_enq.village_id, "id", "village_name");//$scope.sessionVariable.village_list[$scope.sessionVariable.login_data.village_id];//.split(',')[1];

                }
                $scope.requestData.exchange_req = $scope.sessionVariable.temp_cont_enq.exchange_req ? "Y" : "N";
                $scope.requestData.finance_req = $scope.sessionVariable.temp_cont_enq.finance_req ? "Y" : "N";
                $scope.requestData.test_ride = $scope.sessionVariable.temp_cont_enq.test_ride ? "Y" : "N";
                $scope.requestData.existVeh = $scope.getValueInJson($scope.veh_type_list, $scope.sessionVariable.temp_cont_enq.existVeh, "id", "type");
                $scope.requestData.existMake = $scope.getValueInJson($scope.sessionVariable.temp_cont_enq.make_list, $scope.sessionVariable.temp_cont_enq.existMake, "id", "make_name");
                if ($scope.sessionVariable.temp_cont_enq.existModel == null)
                    $scope.sessionVariable.temp_cont_enq.existModel = "";
                $scope.requestData.existModel = $scope.sessionVariable.temp_cont_enq.existModel;
                $scope.requestData.model_interested = $scope.sessionVariable.temp_cont_enq.X_MODEL_INTERESTED;
                var fol_d = $scope.sessionVariable.temp_cont_enq.FOLLOW_DATE;
                var exp_purchase_d = $scope.sessionVariable.temp_cont_enq.EXPCTD_DT_PURCHASE;
                $scope.requestData.fol_date = date_picker.getDateInFormat(fol_d, "mm/dd/yyyy");
                $scope.requestData.exp_purchase_date = date_picker.getDateInFormat(exp_purchase_d, "mm/dd/yyyy");
                $scope.requestData.dealer_code = $scope.sessionVariable.login_data.dealer_code;

                var camp_counter = 1; //open campaigns
                for (i = 0; i < $scope.sessionVariable.campaign.campaign_data.length; i++) {
                    if ($scope.sessionVariable.campaign.campaign_data[i].check == true)
                        $scope.requestData["campid" + (camp_counter++)] = $scope.sessionVariable.campaign.campaign_data[i].camp_id;
                }

                //previous_selected campaigns without open campaigns
                if ($scope.sessionVariable.contact_list.campaign) {
                    for (i = 0; i < $scope.sessionVariable.contact_list.campaign.length; i++) {
                        var campaign = $scope.sessionVariable.contact_list.campaign[i];
                        if (!$scope.isCampaignOpen(i) && $scope.taggedWithEnquiry(i)) {
                            $scope.requestData["campid" + (camp_counter++)] = campaign.ROW_ID;
                        }//end if
                    }//end for
                }//end if

                generic_http_post_service.getDetails(generic_http_post_service.getServices().SYNC_RECORDS,
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
            //$scope.sessionVariable.temp_cont_enq.fol_date = "";
            //$scope.sessionVariable.temp_cont_enq.exp_purchase_date = "";
            if (data.success == 1) {
                var msg = "";
                if (!$scope.isExisitingEnquiry) {
                    msg = 'Enquiry has been edited successfully';
                    //  $scope.isExisitingEnquiry = false;
                } else {
                    msg = 'Enquiry has been created successfully';
                    $scope.isExisitingEnquiry = false;
                }
                $scope.showAlertWindow_Titled('Success', msg, $scope.after_saveTempVehicle);
            } else {
                $scope.showAlertWindow_Titled('Error', data.resDescription);
            }
        }

        $scope.after_saveTempVehicle = function () {
            $scope.sessionVariable.temp_cont_enq = {};
            $scope.sessionVariable.selected_enquiry_edit = {};
            $scope.disableBack();
            $scope.jumpTo('app.dashboard');
        }


        $scope.onChangeCampaign = function (index) {
            var checkVal = $scope.sessionVariable.campaign.campaign_data[index].check;
            /*already max seleted can't select more 
            but as user already seleted it we need to deselect it again*/
            var memberCount = 0;
            //get count of already selected previous campaigns
            for (i = 0; i < $scope.sessionVariable.contact_list.campaign.length; i++) {
                var campaign = $scope.sessionVariable.contact_list.campaign[i];
                if (!$scope.isCampaignOpen(i) && $scope.taggedWithEnquiry(i)) {
                    memberCount++;
                }//end if
            }//end for

            for (i = 0; i < $scope.sessionVariable.campaign.campaign_data.length; i++) {
                if ($scope.sessionVariable.campaign.campaign_data[i].check == true)
                    memberCount++;
            }
            if (memberCount == 4 && checkVal == true) {
                $scope.sessionVariable.campaign.campaign_data[index].check = !checkVal;
                $scope.showAlertWindow_Titled("oops!", "Can't choose more then 3 campaigns")
                return;
            }

        }//end onChangeCampaign

        $scope.isCampaignSeleted = function (index) {
            var retval = false;
            var item = $scope.sessionVariable.campaign.campaign_data[index];
            for (i = 0; i < $scope.sessionVariable.contact_list.campaign.length; i++) {
                if (item.ENQUIRY_ID == $scope.sessionVariable.contact_list.campaign[i].OPTY_ID) {
                    $scope.sessionVariable.campaign.campaign_data[index].check = true;
                    retval = true;
                    $scope.onChangeCampaign(index); // checked true
                }//END IF
            }//end for
            return retval;
        }//end func

        $scope.isCampaignOpen = function (index) {
            var retval = false;
            var item = $scope.sessionVariable.contact_list.campaign[index];
            for (i = 0; i < $scope.sessionVariable.campaign.campaign_data.length; i++) {
                if (item.ROW_ID == $scope.sessionVariable.campaign.campaign_data[i].camp_id) {
                    retval = true;
                }//END IF
            }//end for
            return retval;
        }//end func

        $scope.taggedWithEnquiry = function (index) {
            var retval = false;
            var item = $scope.sessionVariable.contact_list.campaign[index];
            if (item.OPTY_ID == $scope.sessionVariable.selected_enquiry_edit.ENQUIRY_ID) {
                retval = true;
            }//END IF
            return retval;
        }//end func

        $scope.onModelChange = function (model, onLoad) {
            var data = model;

            if (onLoad) {
                $scope.previous_selectedModel = data;
                $scope.fetchCampaign(data);
            } else {
                $scope.showConfirm2("Change model !!", "Be careful, changing model will permanantly removed previously added campaigns with this enquiry", data, $scope.onModelChange_callback, null, null)
            }
        }

        $scope.onModelChange_callback = function (res, data) {
            if (res) {
                $scope.previous_selectedModel = data;
                $scope.sessionVariable.contact_list.campaign = [];
                $scope.fetchCampaign(data);
            } else {
                $scope.sessionVariable.temp_cont_enq.X_MODEL_INTERESTED = $scope.previous_selectedModel;
            }
        }

    });
