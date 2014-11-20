'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, buildingSvc) {
      $scope.selectedBuilding = buildingSvc.getSelectedBuilding();
      $scope.buildingData = [];

      //get resource info for building
      buildingSvc.getBuildingData($scope.selectedBuilding.name).then(function (data) {
          $scope.buildingData = data;
      });
  });
