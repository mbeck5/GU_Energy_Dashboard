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

        //can't have '/' in url
        $scope.returnCorrectName = function(index) {
            return $scope.filteredBuildings[index].name.replace("/", " ");
        };

        function filterBuildings(element) {
            return element.name.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
        }
  });
