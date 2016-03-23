
angular.module('starter.enquiryDetail', [])

	.controller('enquiryDetailCtrl', function ($scope) {

		$scope.$on('filterFollowups', function (event, data) {
			if (data == 'close') {
				$scope.goBackScreen();
			} else if(data == 'follow'){
				$scope.$digest();
			}else{
				$scope.$scope.showToast('oops! No action passed ' );
			}
        });

	});
