angular.module('starter.createEnquiry', [])

    .controller('createEnquiryCtrl', function ($scope, date_picker) {


        $scope.sessionVariable.createEnquiry = {};// for create enquiry
        $scope.sessionVariable.temp_cont_enq.exp_purchase_date = '2016-03-10';



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
           
            if(!dateString){
                var nextDate = date_picker.addDays(new Date(), -1);
                dateString = date_picker.convertDateToString(nextDate, 'yyyy-mm-dd');
            }else{
                return;
            }
            $scope.sessionVariable.temp_cont_enq.fol_date = dateString;//date_picker.getDateWithMonthName(dateString);
        }

        $scope.saveTempEnquiry = function () {
            if(!$scope.sessionVariable.temp_cont_enq.model_interested){
                $scope.showAlertWindow_Titled('Error', 'Please select a model');
                return;
            }
            //if(!$scope.sessionVariable.temp_cont_enq.exp_purchase_date){
            //    $scope.showAlertWindow_Titled('Error', 'Please select a date of purcahse ');
            //    return;
            //}
            if(!$scope.sessionVariable.temp_cont_enq.fol_date){
                $scope.showAlertWindow_Titled('Error', 'Please select a followup date');
                return;
            }

            if($scope.sessionVariable.temp_cont_enq.existVeh == 1){
                if(!$scope.sessionVariable.temp_cont_enq.existMake){
                    $scope.showAlertWindow_Titled('Error', 'Please select make in dropdown');

                    return;
                }

                if(!$scope.sessionVariable.temp_cont_enq.existModel){
                    $scope.showAlertWindow_Titled('Error', 'Please select model in dropdown');
                    return;
                }

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
           $scope.requestData = {};
           $scope.requestData = $scope.sessionVariable.temp_cont_enq;
           $scope.requestData.state = $scope.sessionVariable.login_data.state_id.split(',')[1];
           $scope.requestData.district = $scope.sessionVariable.login_data.district_id.split(',')[1];
           $scope.requestData.tehsil = $scope.sessionVariable.login_data.tehsil_id.split(',')[1];
           $scope.requestData.village = $scope.sessionVariable.login_data.village_id.split(',')[1];
           alert($scope.requestData.state);
           alert(JSON.stringify($scope.requestData));
            $scope.showAlertWindow_Titled('Success', 'Enquiry has been created successfully', $scope.after_saveTempVehicle);
        }

        $scope.after_saveTempVehicle = function(){
            $scope.sessionVariable.temp_cont_enq = {};
            $scope.disableBack();
            $scope.jumpTo('app.dashboard');
        }

    });
