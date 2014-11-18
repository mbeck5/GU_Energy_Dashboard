'use strict';

angular.module('clientApp')
  .factory('buildingSvc', function (Restangular) {
    var selectedBuilding = 'DESELECTED';

    function getBuildings() {
      var allBuildings = Restangular.all('getBuildings');
      return allBuildings.getList();
    }

    function getBuildingData(building) {
      var buildingData = Restangular.all('getBuildingData');
      return buildingData.getList({"building": building});
    }

    function getSelectedBuilding() {
      return selectedBuilding;
    }

    function setSelectedBuilding(building) {
      selectedBuilding = building;
    }

    return {
      getBuildings: getBuildings,
      getBuildingData: getBuildingData,
      getSelectedBuilding: getSelectedBuilding,
      setSelectedBuilding: setSelectedBuilding
    };
  });
