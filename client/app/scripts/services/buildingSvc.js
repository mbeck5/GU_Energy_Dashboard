'use strict';

angular.module('clientApp')
  .factory('buildingSvc', function () {
    var selectedBuilding = 'DESELECTED';

    function getSelectedBuilding() {
      return selectedBuilding;
    }

    function setSelectedBuilding(building) {
      selectedBuilding = building;
    }

    return {
      getSelectedBuilding: getSelectedBuilding,
      setSelectedBuilding: setSelectedBuilding
    };
  });
