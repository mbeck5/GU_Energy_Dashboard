'use strict';

angular.module('clientApp')
  .factory('BuildingService', function () {
    var selectedBuilding;

    function getSelectedBuilding() {
      return selectedBuilding;
    }

    function setSelectedBuilding(building) {
      selectedBuilding = building;
    }

    return {
      getSelectedBuilding: getSelectedBuilding(),
      setSelectedBuilding: setSelectedBuilding()
    };
  });
