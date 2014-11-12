'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope, buildingSvc) {
        var buildings = [];
        $scope.searchInput = '';
        $scope.filteredBuildings = [];

        //unpack promise returned from rest call
        buildingSvc.getBuildings().then(function (data) {
          buildings = data;
          $scope.filteredBuildings = buildings;
        });

        //filters based on search input
        $scope.filterBuildings = function() {
            $scope.filteredBuildings = buildings.filter(filterBuildings);
        };

        //when clicking on building
        $scope.selectBuilding = function (index) {
            buildingSvc.setSelectedBuilding($scope.filteredBuildings[index]);
        };

        function filterBuildings(element) {
            return element.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
        }
  });
