'use strict';

var angular = require('angular');
require('angular-route');

var app = angular.module('bhApp', ['ngRoute']);

app.config(function($routeProvider) {

  $routeProvider.when('/', {
    templateUrl: 'views/dashboard.html',
    controller: 'dashboardCtrl',
  })
  .otherwise({
    redirectTo: '/',
  });
});

app.factory('dashboardSrvc', require('./services/dashboard'));

app.controller('dashboardCtrl', require('./controllers/dashboard'));

app.directive('bsSwitch', require('./directives/bootstrap-switch'));
