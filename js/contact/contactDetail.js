
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
            $scope.sessionVariable.selected_enquiry = item;
            $scope.jumpTo('app.enquiryDetail');
        }

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

    });
