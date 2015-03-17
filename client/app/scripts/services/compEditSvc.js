'use strict';

angular.module('clientApp')
  .factory('compEditSvc', function (Restangular) {
    var selectedComp = 'DESELECTED';
    var startDate = '';
    var endDate = '';

    function getComp() {
      var allComps = Restangular.all('getCompetitions');
      return allComps.getList();
    }

    function saveNewComp(cid, startDate, endDate, compName) {
      var newComp = Restangular.all('saveNewComp');
      return newComp.post({cid: cid, startDate: startDate, endDate: endDate, compName: compName});
    }

    function editNewComp(cid, startDate, endDate, compName) {
      var editedComp = Restangular.all('editNewComp');
      return editedComp.post({cid: cid, startDate: startDate, endDate: endDate, compName: compName});
    }

    function deleteComp(cid) {
      var deletedComp = Restangular.all('deleteComp');
      return deletedComp.post({cid: cid});
    }

    function addCompBuilding(cid, bid) {
      var newBuilding = Restangular.all('addCompBuilding');
      return newBuilding.post({cid: cid, bid: bid});
    }

    function deleteCompBuildings(cid) {
      var deleteBidQ = Restangular.all('deleteCompBuildings');
      return deleteBidQ.post({cid: cid});
    }

    function getCompBuildingList(cid) {
      var newBuildingList = Restangular.all('getCompBuildingList');
      return newBuildingList.getList({cid: cid});
    }

    function saveListOfBuildings(bidList, cid)
    {
      for (var property in bidList) {
        if (bidList[property]) {
          addCompBuilding(cid, property);
        }
      }
    }

    function getBuildingTotals(startDate, endDate, competitionId){
      var buildingTotalList = Restangular.all('getBuildingTotals');
      return buildingTotalList.getList({startDate: startDate, endDate: endDate, competitionId: competitionId});
    }

    function getSelectedComp() {
      return selectedComp;
    }

    function getSelectedCompCid() {
      return selectedComp.cid;
    }

    function setSelectedComp(comp) {
      selectedComp = comp;
    }

    function saveStartDate(newStartDate) {
      startDate = newStartDate;
    }

    function saveEndDate(newEndDate) {
      endDate = newEndDate;
    }

    function getStartDate() {
      return startDate;
    }

    function getEndDate() {
      return endDate;
    }

    return {
      getComp: getComp,
      saveNewComp: saveNewComp,
      editNewComp: editNewComp,
      deleteComp: deleteComp,
      addCompBuilding: addCompBuilding,
      deleteCompBuildings: deleteCompBuildings,
      getCompBuildingList: getCompBuildingList,
      saveListOfBuildings: saveListOfBuildings,
      getBuildingTotals: getBuildingTotals,
      getSelectedComp: getSelectedComp,
      getSelectedCompCid: getSelectedCompCid,
      setSelectedComp: setSelectedComp,
      saveStartDate: saveStartDate,
      saveEndDate: saveEndDate,
      getStartDate: getStartDate,
      getEndDate: getEndDate
    };
  });
