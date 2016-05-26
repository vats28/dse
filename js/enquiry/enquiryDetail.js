
angular.module('starter.enquiryDetail', [])

    .controller('enquiryDetailCtrl', function($scope) {

        $scope.$on('filterFollowups', function(event, data) {
            if (data == 'close') {
                $scope.goBackScreen();
            } else if (data == 'follow') {
                $scope.$digest();
            } else {
                $scope.$scope.showToast('oops! No action passed ');
            }
        });

        $scope.editEnquiry = function() {
            $scope.sessionVariable.createNewEnquiry = false;
            $scope.sessionVariable.selected_enquiry_edit = $scope.sessionVariable.selected_enquiry;
            $scope.jumpTo('app.editEnquiry');
        }//end

    });
