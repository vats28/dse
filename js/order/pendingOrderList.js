
angular.module('starter.pendingOrderList', [])

    .controller('pendingOrderListCtrl', function($scope, $ionicPopup, generic_http_post_service, date_picker) {
        $scope.arrayList = {};
        $scope.init = function() {
            $scope.find_saved_data();
        }//end init

        $scope.find_saved_data = function() {
            var pendingOrders = null;
            try {
                pendingOrders = JSON.parse($scope.GetInLocalStorage($scope.localStorageKeys.PENDING_ORDERS));
            } catch (error) { }

            try {
                //if its already available 
                if (pendingOrders) {
                    $scope.arrayList = pendingOrders;
                }
                $scope.Fetch_orders();//refresh list in any case
            } catch (error) {
                alert(error);
            }
        }


        $scope.Fetch_orders = function() {
            $scope.dataRefreshing = true;
            $scope.requestData = {};
            $scope.requestData.user_id = $scope.sessionVariable.username;
            $scope.requestData.dealer_code = $scope.sessionVariable.login_data.dealer_code;
            generic_http_post_service.getDetails(generic_http_post_service.getServices().FETCH_ORDER_DATA,
                $scope.requestData, $scope.Fetch_orders_callback);
        }


        $scope.Fetch_orders_callback = function(data) {
            $scope.dataRefreshing = false;
            if (data.success == 1) {
                $scope.SaveInLocalStorage($scope.localStorageKeys.PENDING_ORDERS, JSON.stringify(data));
                $scope.arrayList = data;
            } else {
                $scope.showAlertWindow_Titled("Error", data.respDescription, null, null);
            }
        }
    });
