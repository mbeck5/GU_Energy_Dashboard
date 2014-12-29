'use strict';

angular.module('clientApp')
  .factory('buildingSvc', function (Restangular) {
    var selectedBuilding = 'DESELECTED';

    function getBuildings() {
      var allBuildings = Restangular.all('getBuildings');
      return allBuildings.getList();
    }

    function getBuildingData(buildingId, meterTypeId) {
      var buildingData = Restangular.all('getBuildingData');
      return buildingData.getList({building: buildingId, meterType: meterTypeId});
    }

    function getBuildingDataFromName(buildingName, meterTypeId) {
      var buildingData = Restangular.all('getBuildingDataFromName');
      return buildingData.getList({building: buildingName, meterType: meterTypeId});
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
      getBuildingDataFromName: getBuildingDataFromName,
      getSelectedBuilding: getSelectedBuilding,
      setSelectedBuilding: setSelectedBuilding
    };
  });
