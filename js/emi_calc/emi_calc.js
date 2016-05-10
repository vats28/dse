angular.module('starter.emiCalc', [])

    .controller('emiCalcCtrl', function($scope, generic_http_post_service, fileTransfer, $ionicPlatform) {

        window.addEventListener('native.keyboardshow', function() {
            //document.body.classList.add('keyboard-open');
            //$scope.temp.isKeyboard = true;
            document.getElementById('keyboardButton').style.display = '';
            console.log('keyboard-open' +  $scope.temp.isKeyboard);
        });
        window.addEventListener('native.keyboardhide', function() {
            //document.body.classList.add('keyboard-open');
            $scope.temp.isKeyboard = false;
            document.getElementById('keyboardButton').style.display = 'none';
            console.log('keyboard-hide' +  $scope.temp.isKeyboard);
        });
        
        $scope.init = function() {
            $scope.temp = {};
            document.getElementById('keyboardButton').style.display = 'none';
        }
        $scope.calculate = function() {
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

        $scope.createPieChart = function() {
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
