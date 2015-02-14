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
      return newComp.getList({cid: cid, startDate: startDate, endDate: endDate, compName: compName});
    }

    function editNewComp(cid, startDate, endDate, compName) {
      var editedComp = Restangular.all('editNewComp');
      return editedComp.getList({cid: cid, startDate: startDate, endDate: endDate, compName: compName});
    }

    function deleteComp(cid) {
      var deletedComp = Restangular.all('deleteComp');
      return deletedComp.getList({cid: cid});
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
      getSelectedComp: getSelectedComp,
      getSelectedCompCid: getSelectedCompCid,
      setSelectedComp: setSelectedComp,
      saveStartDate: saveStartDate,
      saveEndDate: saveEndDate,
      getStartDate: getStartDate,
      getEndDate: getEndDate
    };
  });
