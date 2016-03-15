angular.module('starter.createNewEnquiry', [])

    .controller('createNewEnquiryCtrl', function ($scope, date_picker) {


        $scope.createNewEnquiry = {};// for create enquiry
        $scope.init = function () {

            $scope.sessionVariable.existVeh = "-1";
        }
        $scope.saveTempEnquiry = function () {
            $scope.jumpTo('app.contactDetail');
        }

        $scope.data = {};
        $scope.data.expDate = 'dd-mm-yyyy';
        $scope.data.folDate = 'dd-mm-yyyy';
        $scope.data.folTime = 'hh:mm';
        $scope.selectedModel = '';
        $scope.pickDate = function (model) { //alert('d'); 
            $scope.selectedModel = model;
            date_picker.getDate('date', $scope.pickDate_callback);
        }
        $scope.pickDate_callback = function (data) {
            if ($scope.selectedModel == 'fol') {
                $scope.data.expDate = data.currDate;
            } else if ($scope.selectedModel == 'exp') {
                $scope.data.folDate = data.currDate;
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
    });
