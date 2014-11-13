'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope, buildingSvc) {
        $scope.searchInput = '';
        var buildings = ['Crosby', 'Herak', 'Paccar', 'Kennedy', 'Madonna', 'Roncalli', 'Lincoln', 'Jepson', 'Dillon', 'Goller', 'Campion',
          'College Hall', 'Cog', 'MiniCog','Dead Cog', 'Student Center', 'Corkery'];
        $scope.filteredBuildings = buildings;

        $scope.filterBuildings = function() {
            $scope.filteredBuildings = buildings.filter(filterBuildings);
        };

        $scope.selectBuilding = function (index) {
            buildingSvc.setSelectedBuilding($scope.filteredBuildings[index]);
        };

        function filterBuildings(element) {
            return element.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
        }
  });
