'use strict';

module.exports = function($scope, $http, $routeParams, dashboardSrvc) {

    $scope.data = dashboardSrvc;

    if ($routeParams.room) {

	dashboardSrvc.selected = $routeParams.room;
    }

};
