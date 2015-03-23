'use strict';

module.exports = function($scope, $http, dashboardSrvc) {
    $scope.name = 'hi m ';

    $scope.data = dashboardSrvc;
    console.log(dashboardSrvc);

    // updateDashboard();

    // function updateDashboard() {
    // 	$http.get('/api/dashboard').success(function(data) {
    //         console.log(data);
    //         $scope.data = data;
    // 	    $timeout(updateDashboard, 200);
    // 	}).error(updateDashboard);
    // }
};
