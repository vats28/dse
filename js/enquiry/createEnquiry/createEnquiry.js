angular.module('starter.createEnquiry', [])

    .controller('createEnquiryCtrl', function ($scope, date_picker, generic_http_post_service, $ionicPopup) {

        $scope.sessionVariable.createEnquiry = {};// for create enquiry
        //$scope.sessionVariable.temp_cont_enq.exp_purchase_date = '2016-03-27';
        $scope.init = function () {
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
                // alert(error);
                console.log("make model not found  " + error);
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
        $scope.pickDate = function (model) { //alert('d'); 
            $scope.selectedModel = model;
            date_picker.getDate('date', $scope.pickDate_callback, false);
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
                $scope.sessionVariable.selected_enquiry = null; //just to be safe

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

                if ($scope.sessionVariable.temp_cont_enq.exp_purchase_date) {
                    var smaller = $scope.sessionVariable.temp_cont_enq.fol_date;
                    var bigger = $scope.sessionVariable.temp_cont_enq.exp_purchase_date;
                    if (date_picker.isGreaterDate(smaller, bigger) == 2) {//2 means not smaller but greater 1 smaller 3 equal
                        $scope.showAlertWindow_Titled('Error', 'Followup date should be smaller then expected purchase date');
                        return;
                    }
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
                $scope.sessionVariable.testride_key = randomString(7);
                $scope.requestData.key = $scope.sessionVariable.testride_key; //this key will be used in saving testride feedback for new enquiry.
                //alert($scope.sessionVariable.login_data.state_id);
                $scope.requestData.state = $scope.getValueInJson($scope.sessionVariable.state_list, $scope.sessionVariable.login_data.state_id, "id", "state_name");//$scope.sessionVariable.state_list[$scope.sessionVariable.login_data.state_id];//.split(',')[1];
                $scope.requestData.district = $scope.getValueInJson($scope.sessionVariable.district_list, $scope.sessionVariable.login_data.district_id, "id", "district_name");//$scope.sessionVariable.district_list[$scope.sessionVariable.login_data.district_id];//.split(',')[1];
                $scope.requestData.tehsil = $scope.getValueInJson($scope.sessionVariable.tehsil_list, $scope.sessionVariable.login_data.tehsil_id, "id", "tehsil_name");//$scope.sessionVariable.tehsil_list[$scope.sessionVariable.login_data.tehsil_id];//.split(',')[1];
                $scope.requestData.village = $scope.getValueInJson($scope.sessionVariable.village_list, $scope.sessionVariable.login_data.village_id, "id", "village_name");//$scope.sessionVariable.village_list[$scope.sessionVariable.login_data.village_id];//.split(',')[1];
                $scope.requestData.exchange_req = $scope.sessionVariable.temp_cont_enq.exchange_req ? "Y" : "N";
                $scope.requestData.finance_req = $scope.sessionVariable.temp_cont_enq.finance_req ? "Y" : "N";
                $scope.requestData.test_ride = $scope.sessionVariable.temp_cont_enq.test_ride ? "Y" : "N";
                $scope.requestData.existVeh = $scope.getValueInJson($scope.veh_type_list, $scope.sessionVariable.temp_cont_enq.existVeh, "id", "type");
                $scope.requestData.existMake = $scope.getValueInJson($scope.sessionVariable.make_list, $scope.sessionVariable.temp_cont_enq.existMake, "id", "make_name");

                var fol_d = $scope.sessionVariable.temp_cont_enq.fol_date;
                var exp_purchase_d = $scope.sessionVariable.temp_cont_enq.exp_purchase_date;
                $scope.requestData.fol_date = date_picker.getDateInFormat(fol_d, "mm/dd/yyyy");
                $scope.requestData.exp_purchase_date = date_picker.getDateInFormat(exp_purchase_d, "mm/dd/yyyy");
                $scope.requestData.dealer_code = $scope.sessionVariable.login_data.dealer_code;

                var camp_counter = 1;
                for (i = 0; i < $scope.sessionVariable.campaign.campaign_data.length; i++) {
                    if ($scope.sessionVariable.campaign.campaign_data[i].check == true)
                        $scope.requestData["campid" + (camp_counter++)] = $scope.sessionVariable.campaign.campaign_data[i].camp_id;
                }
                //  alert($scope.sessionVariable.temp_cont_enq.fol_date);
                console.log(JSON.stringify($scope.requestData));

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
            $scope.sessionVariable.temp_cont_enq.fol_date = "";
            $scope.sessionVariable.temp_cont_enq.exp_purchase_date = "";
            if (data.success == 1) {
                $scope.showAlertWindow_Titled('Success', 'Enquiry has been created successfully', $scope.after_saveTestRide);
            } else {
                $scope.showAlertWindow_Titled('Error', data.resDescription);
            }
        }

        $scope.after_saveTestRide = function () {
            var template = "Do you like to provide test-ride feedback?";
            $ionicPopup.confirm({
                title: 'Testride',
                template: '<div align="center">' + template + '</div>',
                okType: 'button-assertive',
                cancelType: 'button-dark',
                okText: 'Yes',
                cancelText: 'No Thanks'
            }).then(function (res) {
                $scope.sessionVariable.temp_cont_enq = {};
                //$scope.disableBack();
                $scope.jumpTo('app.dashboard');
                $timeout(function () {
                    if (res) {
                        $scope.jumpTo('app.testride');
                    } else {
                        console.log('You are not sure');
                        $scope.sessionVariable.testride_key = undefined;
                    }
                }, 200);
            });
        }

        $scope.after_confirm = function () {

        }



        $scope.onChangeCampaign = function (index) {
            var checkVal = $scope.sessionVariable.campaign.campaign_data[index].check;
            /*already max seleted can't select more 
            but as user already seleted it we need to deselect it again*/
            var memberCount = 0;
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



    });
