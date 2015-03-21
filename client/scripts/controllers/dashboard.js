'use strict';

module.exports = function($scope, $http) {
    $scope.name = 'hi m ';

    $http.get('/api/dashboard').success(function(data) {
        console.log(data);
        $scope.data = data;
    });
};
