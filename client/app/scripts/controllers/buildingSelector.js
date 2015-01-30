'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope, buildingSvc) {
        var buildings = [];
        $scope.searchInput = '';
        $scope.buildingTypes = [];
        $scope.filteredBuildings = [];

        //get list of buildings
        buildingSvc.getBuildings().then(function (data) {
          buildings = data;
          $scope.filteredBuildings = buildings;
        });

        //get list of building types
        buildingSvc.getBuildingTypes().then(function (data) {
          $scope.buildingTypes = data;
        });

        //filters based on search input
        $scope.filterBuildingsBySearch = function() {
            $scope.filteredBuildings = buildings.filter(function (element) {
              return element.name.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
            });
        };

        $scope.filterBuildingsByType = function(type) {
            $scope.searchInput = "";  //clear the search bar
            $scope.filteredBuildings = buildings.filter(function (element) {
              return type === 1 || element.buildingTypeId === type;
            });
        };

        //when clicking on building
        $scope.selectBuilding = function (index) {
            buildingSvc.setSelectedBuilding($scope.filteredBuildings[index]);
        };

        //can't have '/' in url
        $scope.returnCorrectName = function(index) {
            return $scope.filteredBuildings[index].name.replace("/", "--");
        };
  });
