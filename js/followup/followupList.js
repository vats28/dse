
angular.module('starter.followupList', [])

    .controller('followupListCtrl', function ($scope, $ionicPopup, date_picker) {

        $scope.arrayList = {};
        $scope.arrayList.enquiries = [
            {
                name: 'Anirudhh',
                number: 100989,
                doe: '27-10-2015',//date of enquiry
                model: 'splendor plus',
                dop: '27-11-2015'

            },
            {
                name: 'Pankaj Kapoor',
                number: 100917,
                doe: '04-07-2015',//date of enquiry
                model: 'splendor pro',
                dop: '27-08-2015'

            },
            {
                name: 'Vinay Sharma',
                number: 100918,
                doe: '09-10-2015',//date of enquiry
                model: 'xtreme',
                dop: '11-11-2015'

            },
        ];
        $scope.showDetail = function () {
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
    
    
        $scope.data = {};
        $scope.data.date = "DD-MM-YYYY";
        $scope.data.time = "HH:MM ";
    $scope.pickDateTime = function (callback, index) {
      $scope.pickDate = function(){ //alert('d'); 
      date_picker.getDate('date', $scope.pickDate_callback); };
      $scope.pickDate_callback = function(data){$scope.data.date = data.currDate;}
      $scope.pickTime = function(){ //alert('t');  
      date_picker.getDate('time', $scope.pickTime_callback); };
      $scope.pickTime_callback = function(data){  $scope.data.time = data.currTime;}
      var myPopup = $ionicPopup.show({
        template: '<div align="center"><input type="text" ng-model="data.reason" placeholder="eg: any reason">'+
                    '<br/><h4><a class="positive margin-r-20" ng-bind="data.date" ng-click="pickDate()">24-01-1999</a>'+
                    '<a class="positive" ng-bind="data.time" ng-click="pickTime()">08:15 AM</a></h4>',
        title: 'Next followup',
        subTitle: 'Please enter reason and pick next followup schedule',
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
