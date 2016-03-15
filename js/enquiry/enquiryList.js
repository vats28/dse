
angular.module('starter.enquiryList', [])

.controller('enquiryListCtrl', function ($scope ) {
   $scope.showDetail = function(){
       $scope.jumpTo('app.enquiryDetail');
   }
});
