
angular.module('starter.contactDetail', [])

  .controller('contactDetailCtrl', function ($scope, $ionicPopup,$ionicModal, date_picker) {
    $scope.arrayList = {};

$scope.init = function(){
    //alert('dsbjc');
    $scope.hasEnquiry=false;
}

$scope.checkCount = function () {
    $scope.hasEnquiry = true;
    // alert('ab');
}

$scope.showDetail = function (item) {
    $scope.sessionVariable.contact_list.selected_enquiry = item;
    //alert(JSON.stringify($scope.sessionVariable.contact_list.selected_item));
    $scope.jumpTo('app.enquiryDetail');
}

    $scope.closeEnquiry = function (index) {
      $scope.enterReason($scope.closeEnquiry_callback, index);
    }
    
    $scope.closeEnquiry_callback = function(reason, index){      
      $scope.arrayList.enquiries.splice(index, 1);
     // alert($scope.arrayList.enquiries);
    }


 
    

    $scope.enterReason = function (callback, index) {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.reason">',
        title: 'Enter reason',
        subTitle: 'Please enter reason for this action',
        scope: $scope,
        buttons: [
          { text: 'Cancel',
            type: 'button-dark' },
          {
            text: '<b>Save</b>',
            type: 'button-assertive',
            onTap: function (e) {
              if (!$scope.data.reason) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return callback($scope.data.reason, index);
              }
            }
          }
        ]
      });
    }
    
    $scope.followupEnquiry = function (index) {
      $scope.pickDateTime($scope.followupEnquiry_callback, index);
    }
    
    
    $scope.followupEnquiry_callback = function(reason, index){          
      $scope.arrayList.enquiries.splice(index, 1);
    }
    
    $scope.pickDateTime = function (callback, index) {
      $scope.data = {};
      $scope.pickDate = function(){ date_picker.getDate('date', $scope.pickDate_callback) };
      $scope.pickDate_callback = function(data){$scope.data.date = data.date;}
      $scope.pickTime = function(){ date_picker.getDate('date', $scope.pickTime_callback) };
      $scope.pickTime_callback = function(data){$scope.data.time = data.time;}
      var myPopup = $ionicPopup.show({
        template: '<div align="center"><input type="text" ng-model="data.reason" placeholder="eg: any reason">'+
                    '<br/><h4><a class="positive margin-r-20" ng-model="data.date" ng-click="pickDate()">24-01-1999</a>'+
                    '<a class="positive" ng-model="data.time" ng-click="pickTime()">08:15 AM</a></h4>',
        title: 'Next followup',
        subTitle: 'Please enter reason for this action',
        scope: $scope,
        buttons: [
          { text: 'Cancel',
            type: 'button-dark' },
          {
            text: '<b>Save</b>',
            type: 'button-assertive',
            onTap: function (e) {
              if (!$scope.data.reason) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return callback($scope.data, index);
              }
            }
          }
        ]
      });
    }
  });
