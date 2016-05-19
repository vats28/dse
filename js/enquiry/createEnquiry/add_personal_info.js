angular.module('starter.add_personal_info', [])

    .controller('add_personal_infoCtrl', function($scope, date_picker, generic_http_post_service, form_validator) {


        $scope.data = {};
        $scope.data.age = 'dd-mm-yyyy';
        $scope.selectedModel = '';
        $scope.pickDate = function(model) { //alert('d');
            $scope.selectedModel = model;
            date_picker.getDate('date', $scope.pickDate_callback);
        }
        $scope.pickDate_callback = function(data) {
            if ($scope.selectedModel == 'age') {
                $scope.data.age = data.currDate;
            }
        }
        $scope.pickTime = function() { //alert('t');
            date_picker.getDate('time', $scope.pickTime_callback);
        }

        $scope.getDateWithMonthName = function(dateString) {
            return date_picker.getDateWithMonthName(dateString);
        }

        $scope.init = function() {
            $scope.showLoader("");
            $scope.sessionVariable.temp_cont_enq.email = "";
            try {



                $scope.showLoader('Please wait...');
                //in case full_district data is saved
                var make_model_data = null;
                var fullDistrictData = null;
                var districtData = null;

                //in case district data is already available
                try {
                    // alert($scope.GetInLocalStorage($scope.localStorageKeys.DISTRICT));
                    districtData = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.DISTRICT));


                } catch (error) {

                    // alert(error);
                    console.log("make model not found  " + error);
                    $scope.hideLoader();
                }
                if (districtData) {

                    $scope.sessionVariable.district_list = districtData.district;
                    $scope.sessionVariable.login_data.district_id = $scope.GetInLocalStorage($scope.localStorageKeys.DISTRICT_ID);
                    // alert("districtData.district  " + $scope.sessionVariable.login_data.district_id);

                    try {
                        fullDistrictData = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.ALL_DISTRICT));
                        //alert(JSON.stringify(fullDistrictData));
                        if (fullDistrictData) {
                            $scope.sessionVariable.tehsil_list = fullDistrictData.tehsil;
                            $scope.sessionVariable.village_list = fullDistrictData.village;
                        }
                    } catch (error) {

                        // alert(error);
                        console.log("make model not found  " + error);
                        $scope.hideLoader();
                    }
                } else {
                    $scope.get_district($scope.sessionVariable.login_data.state_id);
                }


                try {
                    make_model_data = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.MAKE_MODEL));

                } catch (error) {

                    // alert(error);
                    console.log("make model not found  " + error);
                    $scope.hideLoader();
                }
                //if its already available dont
                if (make_model_data) {
                    $scope.sessionVariable.make_list = make_model_data.make;
                    $scope.sessionVariable.model_list = make_model_data.model;
                    $scope.sessionVariable.model_interested = make_model_data.model_interested;
                } else {
                    $scope.get_make_model();
                }
                $scope.hideLoader();
            } catch (error) {

                // alert(error);
                console.log("make model not found  " + error);
                $scope.hideLoader();
            }
            //
        }
        //sessionVariable.login_data.state_id

        $scope.onStateChange = function() {    //clear earlier data
            $scope.showConfirm('Are you sure', 'Do you really want to change your district?', null, $scope.onStateChange_callback);

        }

        $scope.onStateChange_callback = function() {
            //clear earlier data
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEHSIL);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.VILLAGE);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.STATE_ID);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.DISTRICT_ID);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEHSIL_ID);
            //clear variables
            $scope.sessionVariable.login_data.district_id = undefined;
            $scope.sessionVariable.login_data.tehsil_id = undefined;

            var loginData = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.STATE));
            loginData.state_id = $scope.sessionVariable.login_data.state_id;
            $scope.SaveInLocalStorage($scope.localStorageKeys.STATE, JSON.stringify(loginData));
            //$scope.sessionVariable.login_data.state_id = data.state_id;
            // fetch new districts
            $scope.get_district($scope.sessionVariable.login_data.state_id.split(',')[0]);
        }

        $scope.onDistrictChange = function() {
            //clear earlier data
            $scope.showConfirm('Are you sure', 'Do you really want to change your district?', null, $scope.onDistrictChange_callback);
        }

        $scope.onDistrictChange_callback = function() {
            //clear earlier data

            $scope.SaveInLocalStorage($scope.localStorageKeys.DISTRICT_ID, $scope.sessionVariable.login_data.district_id);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.VILLAGE);
            $scope.RemoveInLocalStorage($scope.localStorageKeys.TEHSIL_ID);
            //clear variables
            $scope.sessionVariable.login_data.tehsil_id = undefined;
            // fetch new districts
            $scope.get_full_district_data($scope.sessionVariable.login_data.district_id);
        }



        $scope.onTehsilChange = function() {
            /*//clear earlier data
             $scope.RemoveInLocalStorage($scope.localStorageKeys.VILLAGE);
             $scope.RemoveInLocalStorage($scope.localStorageKeys.TEHSIL_ID);
             // fetch new districts
             $scope.get_village();*/
        }

        $scope.checkNumberLength = function(event) {
            var value = "" + $scope.sessionVariable.temp_cont_enq.age;
            if (value.length == 2) {
                event.preventDefault();
            }
        }

        //$scope.sessionVariable.temp_cont_enq.dob = '2015-09-28';
        $scope.saveTempPerInfo = function() {
            if (!$scope.sessionVariable.temp_cont_enq.fname) {
                $scope.showAlertWindow_Titled('Error', 'Please enter first name');
                return;
            }
            if (!$scope.sessionVariable.temp_cont_enq.lname) {
                $scope.showAlertWindow_Titled('Error', 'Please enter last name');
                return;
            }
            
            if (!$scope.sessionVariable.temp_cont_enq.mobile) {
                $scope.showAlertWindow_Titled('Error', 'Please enter mobile');
                return;
            }
            
            if($scope.sessionVariable.temp_cont_enq.email){
                if(!form_validator.IsValidEmail($scope.sessionVariable.temp_cont_enq.email)){
                     $scope.showAlertWindow_Titled('Error', 'Please enter valid email address');
                     return;
                }
            }
            if (!$scope.sessionVariable.temp_cont_enq.age) {
                $scope.showAlertWindow_Titled('Error', 'Please enter age');
                return;
            }
            if (!$scope.sessionVariable.temp_cont_enq.gender) {
                $scope.showAlertWindow_Titled('Error', 'Please select gender');
                return;
            }
            //if(!$scope.sessionVariable.temp_cont_enq.phone){
            //    $scope.showAlertWindow_Titled('Error', 'Please enter phone');
            //    return;
            //}
            //if(!$scope.sessionVariable.temp_cont_enq.email){
            //    $scope.showAlertWindow_Titled('Error', 'Please enter email');
            //    return;
            //}
            //alert($scope.sessionVariable.temp_cont_enq.email);
            // if (!$scope.sessionVariable.temp_cont_enq.email) {
            //     $scope.showAlertWindow_Titled('Error', 'Please enter valid email address');
            //     return;
            // }
            if (!$scope.sessionVariable.login_data.state_id) {
                $scope.showAlertWindow_Titled('Error', 'Please select state');
                return;
            }
            if (!$scope.sessionVariable.login_data.district_id) {
                $scope.showAlertWindow_Titled('Error', 'Please select district');
                return;
            }
            if (!$scope.sessionVariable.login_data.tehsil_id) {
                $scope.showAlertWindow_Titled('Error', 'Please select tehsil');
                return;
            }
            if (!$scope.sessionVariable.login_data.village_id) {
                $scope.showAlertWindow_Titled('Error', 'Please select village');
                return;
            }//sessionVariable.login_data.tehsil_id
            // if (!$scope.sessionVariable.temp_cont_enq.address1) {
            //     $scope.showAlertWindow_Titled('Error', 'Please enter address1');
            //     return;
            // }
            // if (!$scope.sessionVariable.temp_cont_enq.pincode) {
            //     $scope.showAlertWindow_Titled('Error', 'Please enter pincode');
            //     return;
            // }
            $scope.jumpTo('app.createEnquiry');

        }

    });
