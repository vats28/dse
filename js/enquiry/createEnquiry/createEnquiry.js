angular.module('starter.createEnquiry', [])

    .controller('createEnquiryCtrl', function ($scope, date_picker) {


        $scope.sessionVariable.createEnquiry = {};// for create enquiry




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
            //alert(dateString);
            if(!dateString){
                dateString = date_picker.convertDateToString(new Date().setDate(1), 'yyyy-mm-dd');
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
            $scope.showAlertWindow_Titled('Success', 'Enquiry has been created successfully', $scope.after_saveTempVehicle);
        }

    });
