angular.module('starter.emiCalc', [])

    .controller('emiCalcCtrl', function ($scope, generic_http_post_service, fileTransfer, $ionicPlatform) {

        window.addEventListener('native.keyboardshow', function () {
            //document.body.classList.add('keyboard-open');
            //$scope.temp.isKeyboard = true;
            document.getElementById('keyboardButton').style.display = '';
            console.log('keyboard-open' + $scope.temp.isKeyboard);
        });
        window.addEventListener('native.keyboardhide', function () {
            //document.body.classList.add('keyboard-open');
            $scope.temp.isKeyboard = false;
            document.getElementById('keyboardButton').style.display = 'none';
            console.log('keyboard-hide' + $scope.temp.isKeyboard);
        });

        $scope.init = function () {
            $scope.temp = {
                amount1: 0,
                months1: 0,
                rate1: 0,
            };
            document.getElementById('keyboardButton').style.display = 'none';
        }
        $scope.calculate = function (val) {
            if (val == 1) {
                $scope.temp.amount = $scope.temp.amount1;
            } else if (val == 2) {
                $scope.temp.months = $scope.temp.months1;
            } else if (val == 3) {
                $scope.temp.rate = $scope.temp.rate1;
            } else if (val == 4) {
                $scope.temp.amount1 = $scope.temp.amount;
            } else if (val == 5) {
                $scope.temp.months1 = $scope.temp.months;
            } else if (val == 6) {
                $scope.temp.rate1 = $scope.temp.rate;
            }
            if (!$scope.temp.amount || !$scope.temp.months || !$scope.temp.rate) {
                //$scope.temp.calculated = "Incomplete data";
            }
            else {
                var princ = $scope.temp.amount;
                var term = $scope.temp.months;
                var intr = $scope.temp.rate / 1200;
                $scope.temp.calculated = (princ * intr / (1 - (Math.pow(1 / (1 + intr), term)))).toFixed(2);
                $scope.temp.total_interest = ($scope.temp.calculated * $scope.temp.months - $scope.temp.amount).toFixed(2);
                $scope.temp.amount_to_pay = ($scope.temp.calculated * $scope.temp.months).toFixed(2);
                $scope.createPieChart();
            }
        }//end


        $scope.onAdd = function (val) {
            var maxAmount = 500000;
            var maxMonth = 84;
            var maxRate = 30;
            $scope.temp.amount = parseInt($scope.temp.amount);
            $scope.temp.amount1 = parseInt($scope.temp.amount1);
            $scope.temp.rate = parseInt($scope.temp.rate);
            $scope.temp.rate1 = parseInt($scope.temp.rate1);
            $scope.temp.months = parseInt($scope.temp.months);
            $scope.temp.months1 = parseInt($scope.temp.months1);
            if (val == 1) {
                $scope.temp.amount = $scope.temp.amount1 = $scope.temp.amount ? $scope.temp.amount : 0;
                if ($scope.temp.amount < maxAmount) {
                    $scope.temp.amount += 500;
                    $scope.temp.amount1 += 500;
                    if($scope.temp.amount > maxAmount){
                         $scope.temp.amount =  $scope.temp.amount1 = maxAmount;
                    }
                }
            } else if (val == 2) {
                $scope.temp.months = $scope.temp.months1 = $scope.temp.months ? $scope.temp.months : 0;
                if ($scope.temp.months < maxMonth) {
                    $scope.temp.months += 1;
                    $scope.temp.months1 += 1;
                    if($scope.temp.months > maxMonth){
                         $scope.temp.months =  $scope.temp.months1 = maxMonth;
                    }
                }
            } else if (val == 3) {
                $scope.temp.rate = $scope.temp.rate1 = $scope.temp.rate ? $scope.temp.rate : 0;
                if ($scope.temp.rate < maxRate) {
                    $scope.temp.rate += 1;
                    $scope.temp.rate1 += 1;
                    if($scope.temp.rate > maxRate){
                         $scope.temp.rate =  $scope.temp.rate1 = maxRate;
                    }
                }
            }

            $scope.calculate(1);
        }

        $scope.onMinus = function (val) {
            $scope.temp.amount = parseInt($scope.temp.amount);
            $scope.temp.amount1 = parseInt($scope.temp.amount1);
            $scope.temp.rate = parseInt($scope.temp.rate);
            $scope.temp.rate1 = parseInt($scope.temp.rate1);
            $scope.temp.months = parseInt($scope.temp.months);
            $scope.temp.months1 = parseInt($scope.temp.months1);
            if (val == 1) {
                if ($scope.temp.amount > 0) {
                    $scope.temp.amount -= 500;
                    $scope.temp.amount1 -= 500;
                    if($scope.temp.amount < 0){
                         $scope.temp.amount =  $scope.temp.amount1 = 0;
                    }
                }
            } else if (val == 2) {
                if ($scope.temp.months > 0) {
                    $scope.temp.months -= 1;
                    $scope.temp.months1 -= 1;
                    if($scope.temp.months < 0){
                         $scope.temp.months =  $scope.temp.months1 = 0;
                    }
                }
            } else if (val == 3) {
                if ($scope.temp.rate > 0) {
                    $scope.temp.rate -= 1;
                    $scope.temp.rate1 -= 1;
                    if($scope.temp.rate < 0){
                         $scope.temp.rate =  $scope.temp.rate1 = 0;
                    }
                }
            }
            
            $scope.calculate(1);
        }



        $scope.createPieChart = function () {
            var config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [
                            $scope.temp.total_interest,
                            $scope.temp.amount,
                        ],
                        backgroundColor: [
                            "#FF0000",
                            "#000",
                        ],
                        label: 'Interest & EMI chart'
                    }],
                    labels: [
                        "Interest",
                        "Actual Amount",
                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: ''
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            }; //end config

            var ctx = document.getElementById("chart-area").getContext("2d");
            window.myDoughnut = new Chart(ctx, config);
        }




    });
