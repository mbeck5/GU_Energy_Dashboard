'use strict';

angular.module('clientApp')
  .factory('buildingSvc', function (Restangular) {
    var selectedBuildings = ['DESELECTED'];

    function getBuildings() {
      var allBuildings = Restangular.all('getBuildings');
      return allBuildings.getList();
    }

    function getBuildingData(buildingId, meterTypeId, isDetailed, startDate, endDate) {
      var buildingData = Restangular.all('getBuildingData');
      return buildingData.getList({building: buildingId, meterType: meterTypeId, isDetailed: isDetailed, startDate: startDate, endDate: endDate});
    }

    function getResourceByType(meterTypeId, startDate, endDate){
      var resourceData = Restangular.all('getResourceByType');
      return resourceData.getList({meterType: meterTypeId, startDate: startDate, endDate: endDate});
    }

    function getBuildingDataFromName(buildingName, meterTypeId, isDetailed, startDate, endDate) {
      var buildingData = Restangular.all('getBuildingDataFromName');
      return buildingData.getList({building: buildingName, meterType: meterTypeId, isDetailed: isDetailed, startDate: startDate, endDate: endDate});
    }

    function getResourceSum(meterTypeId){
      var resourceSum = Restangular.all('getResourceSum');
      return resourceSum.getList({meterType: meterTypeId});
    }

    function getSelectedBuildings() {
      return selectedBuildings;
    }

    function setSelectedBuilding(building) {
      selectedBuildings = building;
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
      setSelectedBuilding: setSelectedBuilding,
      getSelectedBuildings: getSelectedBuildings
    };
  });
