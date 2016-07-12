angular.module('starter.testride', [])

    .controller('testrideCtrl', function ($scope, $timeout, date_picker, form_validator, generic_http_post_service) {

        $scope.arrayList = {};
        $scope.temp_data = {};
        //$scope.data.answers
        $scope.init = function () {
            $scope.fetch_test_ride();
        }//end

        $scope.fetch_test_ride = function () {
            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.user_id = "1234";//$scope.sessionVariable.username;//$scope.sessionVariable.username;
            if ($scope.sessionVariable.selected_enquiry)
                $scope.requestData.enq_id = $scope.sessionVariable.selected_enquiry.ENQUIRY_ID;
            generic_http_post_service.getDetails(generic_http_post_service.getServices().FETCH_TEST_RIDE,
                $scope.requestData, $scope.fetch_test_ride_callback);
        }//edm
        $scope.fetch_test_ride_callback = function (data) {
            $scope.hideLoader();
            if (data.success == 1) {
                $scope.arrayList = data;
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, $scope.goBackScreen, null);
            }
        }//edm


        $scope.submit_test_ride = function () {

            $scope.showLoader("");
            $scope.requestData = {};
            $scope.requestData.user_id = $scope.sessionVariable.username;
            if ($scope.sessionVariable.selected_enquiry) {
                $scope.requestData.enq_id = $scope.sessionVariable.selected_enquiry.ENQUIRY_ID;
                $scope.requestData.dealer_id = $scope.sessionVariable.selected_enquiry.DEALER_BU_ID;
            }
            $scope.requestData.key = $scope.sessionVariable.testride_key;
            $scope.ans = {};
            for (i = 0; i < $scope.arrayList.test_ride_ques.length; i++) {
                if ($scope.temp_data[i + 1]) {
                    $scope.ans[(i + 1)] = $scope.temp_data[i + 1];
                }
            }//edn for 

            $scope.requestData.ans = JSON.stringify($scope.ans);
           console.log(JSON.stringify($scope.requestData));
            generic_http_post_service.getDetails(generic_http_post_service.getServices().SYNC_TEST_RIDE,
                $scope.requestData, $scope.submit_test_ride_callback);
        }//edm
        $scope.submit_test_ride_callback = function (data) {
            $scope.hideLoader();
            if (data.success == 1) {
                $scope.showAlertWindow_Titled("Success", "Thanks test ride feedaback submited successfully", $scope.goBackScreen);
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }//edm
    })