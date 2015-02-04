'use strict';

angular.module('clientApp')
  .factory('compEditSvc', function (Restangular) {
    var selectedComp = 'DESELECTED';

    function getComp() {
      var allComps = all('getBuildings');
      return allComps.getList();
    }

    function getCompData(buildingId, meterTypeId) {
      var buildingData = all('getBuildingData');
      return buildingData.getList({building: buildingId, meterType: meterTypeId});
    }

    function getCompDataFromName(buildingName, meterTypeId) {
      var buildingData = all('getBuildingDataFromName');
      return buildingData.getList({building: buildingName, meterType: meterTypeId});
    }

    function getSelectedComp() {
      return 1;
    }

    function setSelectedComp(comp) {
      selectedComp = comp;
    }

    return {
      getComp: getComp,
      getCompData: getCompData,
      getCompDataFromName: getCompDataFromName,
      getSelectedComp: getSelectedComp,
      setSelectedComp: setSelectedComp
    };
  });
