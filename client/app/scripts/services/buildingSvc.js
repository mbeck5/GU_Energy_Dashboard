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

    function getResourceByType(meterTypeId){
      var resourceData = Restangular.all('getResourceByType');
      return resourceData.getList({meterType: meterTypeId});
    }

    function getBuildingDataFromName(buildingName, meterTypeId) {
      var buildingData = Restangular.all('getBuildingDataFromName');
      return buildingData.getList({building: buildingName, meterType: meterTypeId});
    }

    function getResourceSum(meterTypeId){
      var resourceSum = Restangular.all('getResourceSum');
      return resourceSum.getList({meterType: meterTypeId});
    }

    function getSelectedBuilding() {
      return selectedBuilding;
    }

    function setSelectedBuilding(building) {
      selectedBuilding = building;
    }

    function getBuildingTypes(){
      var buildingTypes = Restangular.all('getBuildingTypes');
      return buildingTypes.getList();
    }

    return {
      getBuildings: getBuildings,
      getBuildingData: getBuildingData,
      getResourceByType: getResourceByType,
      getBuildingDataFromName: getBuildingDataFromName,
      getResourceSum: getResourceSum,
      getBuildingTypes: getBuildingTypes,
      getSelectedBuilding: getSelectedBuilding,
      setSelectedBuilding: setSelectedBuilding
    };
  });
