'use strict';

angular.module('clientApp')
  .controller('BuildingSelectorCtrl', function ($scope) {
        $scope.searchInput = '';
        var buildings = ['Crosby', 'Herak', 'Paccar', 'Kennedy', 'Madonna', 'Roncalli', 'Lincoln', 'Jepson', 'Dillon', 'Goller', 'Campion', 'College Hall'];
        $scope.filteredBuildings = buildings;

        $scope.filterBuildings = function() {
            $scope.filteredBuildings = buildings.filter(filterBuildings);
        };

        function filterBuildings(element) {
            return element.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
        }
  });
