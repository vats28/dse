
angular.module('starter.contactList', [])

    .controller('contactListCtrl', function ($scope) {
        $scope.arrayList = [];

        $scope.init = function () {
            if ($scope.sessionVariable.search.phone == "9999999999") {
                $scope.sessionVariable.contact_list = [
                    {
                        name: "Pawan Kumar",
                        phone: "9999999999",
                        city: "Gurgaon"
                    },
                ];
            }//end if
            else{
                $scope.sessionVariable.contact_list = undefined;
            }
        }//end init
        
        $scope.showDetail = function () {
            $scope.jumpTo('app.contactDetail');
        }
    });
