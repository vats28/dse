angular.module('starter.searchFilter', [])

    .controller('searchFilterCtrl', function ($scope, date_picker) {

        $scope.dateModel = {
            EXP_FROM: 1,
            EXP_TO: 2,
            CRT_FROM: 3,
            CRT_TO: 4,
            NXT: 5,
        };

        $scope.pickDate = function (dateModel) {
           
            try {
                // var allowOld = old;//true;
                // var allowFuture = future;// false;
                if ((dateModel == $scope.dateModel.EXP_FROM) && $scope.search_filter.IsExpDate) {
                    date_picker.getDate('date', $scope.pickEXP_FROM_callback, null, null);
                } else if ((dateModel == $scope.dateModel.EXP_TO) && $scope.search_filter.IsExpDate) {
                    date_picker.getDate('date', $scope.pickEXP_TO_callback, null, null);
                } else if ((dateModel == $scope.dateModel.CRT_FROM) && $scope.search_filter.IsCreateDate) {
                    date_picker.getDate('date', $scope.pickCRT_FROM_callback, null, null);
                } else if ((dateModel == $scope.dateModel.CRT_TO) && $scope.search_filter.IsCreateDate) {
                    date_picker.getDate('date', $scope.pickCRT_TO_callback, null, null);
                } else if ((dateModel == $scope.dateModel.NXT) && $scope.search_filter.IsNextDate) {
                    date_picker.getDate('date', $scope.pickNXT_callback, null, null);
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

    });
