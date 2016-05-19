
angular.module('starter.contactDetail', [])

    .controller('contactDetailCtrl', function($scope, $ionicPopup, $ionicModal, date_picker) {
        $scope.arrayList = {};

        $scope.init = function() {
            $scope.hasEnquiry = false;
        }

        $scope.checkCount = function() {
            $scope.hasEnquiry = true;
        }

        $scope.showDetail = function(item) {
            //alert(JSON.stringify(item));
            $scope.sessionVariable.selected_enquiry = item;
            $scope.jumpTo('app.enquiryDetail');
        }
        
        $scope.onAddEnquiry = function(){
            
        }//end

        $scope.$on('filterFollowups', function(event, data) {
            try {
                // if(!$scope)
                // return;
                if (data == 'close') {
                    $scope.hasEnquiry = false;
                }
                $scope.$digest();
            } catch (error) {

            }
        });

        $scope.createNewEnquiry = function() {
            // remove few things in case new enquiry need to created without updating contact info 
            // $scope.sessionVariable.selected_enquiry.X_MODEL_INTERESTED = "";
            // $scope.sessionVariable.selected_enquiry.EXPCTD_DT_PURCHASE = "";
            // $scope.sessionVariable.selected_enquiry.X_EXCHANGE_REQUIRED = "";
            // $scope.sessionVariable.selected_enquiry.X_FINANCE_REQUIRED = "";
            // $scope.sessionVariable.selected_enquiry.EXISTING_VEHICLE = "";
            // $scope.sessionVariable.selected_enquiry.MAKE_CD = "";
            // $scope.sessionVariable.selected_enquiry.MODEL_CD = "";
            // $scope.sessionVariable.selected_enquiry.FOLLOWUP_COMMENTS = "";
            // $scope.sessionVariable.selected_enquiry.ENQUIRY_ID = "";
            // $scope.sessionVariable.selected_enquiry.X_TEST_RIDE_REQ = "";
            // $scope.sessionVariable.selected_enquiry.ENQUIRY_ENTRY_DATE = "";
            // $scope.sessionVariable.selected_enquiry.FOLLOW_DATE = "";
            // $scope.sessionVariable.selected_enquiry_edit = $scope.sessionVariable.selected_enquiry;
            $scope.sessionVariable.selected_enquiry_edit = $scope.sessionVariable.contact_list.selected_item;
            $scope.sessionVariable.createNewEnquiry = true;//this will open third screen on editEnquiry page
            $scope.jumpTo('app.editEnquiry');

        }//end

    });
