'use strict';

angular.module('clientApp')
  .factory('compEditSvc', function (Restangular) {
    var selectedComp = 'DESELECTED';
    var startDate = '';
    var endDate = '';
    var topThree = [];

    //get all competitions
    function getComp() {
      var allComps = Restangular.all('getCompetitions');
      return allComps.getList();
    }

    //gets the inner width of the window
    function getWindowWidth()
    {
      return window.innerWidth;
    }

    //sets the top three buildings from a comp
    function setTopThree(topThreeIn) {
      if (topThreeIn.length > 0)
        topThree = angular.copy(topThreeIn);
    }

    //gets the set top three
    function getTopThree() {
      return topThree;
    }

    //saves a new comp to the database
    function saveNewComp(cid, startDate, endDate, compName, createdBy) {
      var newComp = Restangular.all('saveNewComp');
      return newComp.post({cid: cid, startDate: startDate, endDate: endDate, compName: compName, createdBy: createdBy});
    }

    //edits a new comp in the database
    function editNewComp(cid, startDate, endDate, compName, editedBy) {
      var edited = "," + editedBy;
      var editedComp = Restangular.all('editNewComp');
      return editedComp.post({cid: cid, startDate: startDate, endDate: endDate, compName: compName, editedBy: edited});
    }

    //deletes a comp from the database
    function deleteComp(cid) {
      var deletedComp = Restangular.all('deleteComp');
      return deletedComp.post({cid: cid});
    }

    //adds a building to a selected comp
    function addCompBuilding(cid, bid) {
      var newBuilding = Restangular.all('addCompBuilding');
      return newBuilding.post({cid: cid, bid: bid});
    }

    //deletes the buildings from a comp
    function deleteCompBuildings(cid) {
      var deleteBidQ = Restangular.all('deleteCompBuildings');
      return deleteBidQ.post({cid: cid});
    }

    //gets the list of selected buildings from a comp
    function getCompBuildingList(cid) {
      var newBuildingList = Restangular.all('getCompBuildingList');
      return newBuildingList.getList({cid: cid});
    }

    //saves the checked buildings of a comp
    function saveListOfBuildings(bidList, cid) {
      for (var property in bidList) {
        if (bidList[property]) {
          addCompBuilding(cid, property);
        }
      }
    }

    //gets the totals of usage for each building
    function getBuildingTotals(startDate, endDate, competitionId) {
      var buildingTotalList = Restangular.all('getBuildingTotals');
      return buildingTotalList.getList({startDate: startDate, endDate: endDate, competitionId: competitionId});
    }

    //gets the clicked comp
    function getSelectedComp() {
      return selectedComp;
    }

    //returns the cid of the selected comp
    function getSelectedCompCid() {
      return selectedComp.cid;
    }

    //sets the current viewed comp
    function setSelectedComp(comp) {
      selectedComp = comp;
    }

    //saves the current start date
    function saveStartDate(newStartDate) {
      startDate = newStartDate;
    }

    //saves the current end date
    function saveEndDate(newEndDate) {
      endDate = newEndDate;
    }

    //gets the current start date
    function getStartDate() {
      return startDate;
    }

    //gets the current end date
    function getEndDate() {
      return endDate;
    }

    return {
      getComp: getComp,
      getWindowWidth: getWindowWidth,
      setTopThree: setTopThree,
      getTopThree: getTopThree,
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
