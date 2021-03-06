angular.module('starter.searchFilter', [])

    .controller('searchFilterCtrl', function ($scope, $timeout, date_picker) {

        //   $scope.search_filter.NXT = '2016-03-11';
        //     $scope.search_filter.EXP_TO = '2016-03-16';
        //     $scope.search_filter.EXP_FROM = '2016-03-06';


        ///below this search filter js
        $scope.dateModel = {
            EXP_FROM: 1,
            EXP_TO: 2,
            CRT_FROM: 3,
            CRT_TO: 4,
            NXT: 5,
        };

        // $scope.init = function () {
        //     $scope.setFinance(1);
        // }//end 
        
        
        $scope.default_filter = function () {
        }//ned clear_filter


        $scope.setFinance = function (value) {
            $scope.search_filter.finance = value;
        }
        $scope.setStatus = function (value) {
            $scope.search_filter.status = value;
        }



        $scope.pickDate = function (dateModel) {

            try {
                // var allowOld = old;//true;
                // var allowFuture = future;// false;
                if ((dateModel == $scope.dateModel.EXP_FROM) && $scope.search_filter.IsExpDate) {
                    date_picker.getDate('date', $scope.pickEXP_FROM_callback, true);
                } else if ((dateModel == $scope.dateModel.EXP_TO) && $scope.search_filter.IsExpDate) {
                    if ($scope.search_filter.EXP_FROM) {
                        var thenDate = date_picker.ConvertStringToDate($scope.search_filter.EXP_FROM, 'yyyy-mm-dd');
                        date_picker.getDate('date', $scope.pickEXP_TO_callback, false, false, thenDate);
                    } else {
                        $scope.showAlertWindow_Titled('oh oh!', 'Please select expiry from date first');
                    }
                } else if ((dateModel == $scope.dateModel.CRT_FROM) && $scope.search_filter.IsCreateDate) {
                    date_picker.getDate('date', $scope.pickCRT_FROM_callback, true );
                } else if ((dateModel == $scope.dateModel.CRT_TO) && $scope.search_filter.IsCreateDate) {
                    if ($scope.search_filter.CRT_FROM) {
                        date_picker.getDate('date', $scope.pickCRT_TO_callback, false, false, date_picker.ConvertStringToDate($scope.search_filter.CRT_FROM, 'yyyy-mm-dd') );
                    } else {
                        $scope.showAlertWindow_Titled('oh oh!', 'Please select expiry from date first');
                    }
                } else if ((dateModel == $scope.dateModel.NXT) && $scope.search_filter.IsNextDate) {
                    date_picker.getDate('date', $scope.pickNXT_callback);
                }

            } catch (error) {
                alert(error);
            }
        };
        $scope.pickEXP_FROM_callback = function (data) {
            $scope.search_filter.EXP_FROM = data.currDate;
        }
        $scope.pickEXP_TO_callback = function (data) {
            $scope.search_filter.EXP_TO = data.currDate;
        }
        $scope.pickCRT_FROM_callback = function (data) {
            $scope.search_filter.CRT_FROM = data.currDate;
        }
        $scope.pickCRT_TO_callback = function (data) {
            $scope.search_filter.CRT_TO = data.currDate;
        }
        $scope.pickNXT_callback = function (data) {
            $scope.search_filter.NXT = data.currDate;
        }

        $scope.getDateWithMonthName = function (dateString) {
            return date_picker.getDateWithMonthName(dateString);
        }

        $scope.setSearchFilter = function () {
            $scope.jumpTo('app.searchEnquiryList');

        }

        $scope.clearSearchFilter = function () {
            $scope.search_filter = {};
            $scope.search_filter.finance = 1;
        }

    });
