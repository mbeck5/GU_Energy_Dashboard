'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, buildingSvc) {
      $scope.selectedBuilding = buildingSvc.getSelectedBuilding();
  });
