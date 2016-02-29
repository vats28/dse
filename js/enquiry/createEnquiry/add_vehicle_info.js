
angular.module('starter.addVehicleInfo', [])

    .controller('addVehicleInfoCtrl', function ($scope) {
      $scope.saveTempVehicle = function () {
        //  $scope.show
        $scope.showAlertWindow_Titled('Success', 'Enquiry has been created successfully', $scope.after_saveTempVehicle);
      }
      $scope.after_saveTempVehicle = function () {
        $scope.disableBack();
        $scope.jumpTo('app.dashboard');
      }


      $scope.onExistVeh_Change = function(){

      }//emd

      $scope.onExistMake_Change = function(){

      }//emd

      $scope.onExistModel_Change = function(){

      }//emd
    });
