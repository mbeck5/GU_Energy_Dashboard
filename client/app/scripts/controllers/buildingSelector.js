'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope, buildingSvc) {
        var buildings = [];
        $scope.searchInput = '';
        $scope.buildingTypes = [];
        $scope.filteredBuildings = [];
        $scope.checkedBuildings = [];
        $scope.compareEnabled = false;

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
            if (index) {
              buildingSvc.setSelectedBuilding([$scope.filteredBuildings[index]]);
            }
            else {
              var tempList = [];
              //add building ids marked as true to list
              for (var property in $scope.checkedBuildings) {
                if ($scope.checkedBuildings.hasOwnProperty(property) && $scope.checkedBuildings[property]) {
                  tempList.push(property);
                }
              }
              buildingSvc.setSelectedBuilding(tempList);
            }
        };

        //can't have '/' in url
        $scope.returnCorrectName = function(index) {
            return $scope.filteredBuildings[index].name.replace("/", "--");
        };

        $scope.toggleCompare = function() {
            $scope.compareEnabled = !$scope.compareEnabled;
        };
  });
