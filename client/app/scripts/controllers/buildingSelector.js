'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope, $location) {
        $scope.searchInput = '';
        var buildings = ['Crosby', 'Herak', 'Paccar', 'Kennedy', 'Madonna', 'Roncalli', 'Lincoln', 'Jepson', 'Dillon', 'Goller', 'Campion', 'College Hall'];
        $scope.filteredBuildings = buildings;

        $scope.filterBuildings = function() {
            $scope.filteredBuildings = buildings.filter(filterBuildings);
        };

        $scope.selectBuilding = function (building) {
            $location.path('/buildings/' + building);
        };

        function filterBuildings(element) {
            return element.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
        }
  });
