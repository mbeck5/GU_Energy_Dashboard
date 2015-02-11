'use strict';

angular.module('clientApp')
  .factory('compEditSvc', function (Restangular) {
    var selectedComp = 'DESELECTED';

    function getComp() {
      var allComps = Restangular.all('getCompetitions');
      return allComps.getList();
    }

    function saveNewComp(cid, startDate, endDate, compName, resourceId) {
      var newComp = Restangular.all('saveNewComp');
      return newComp.getList({cid: cid, startDate: startDate, endDate: endDate, compName: compName, resourceId: resourceId});
    }

    function editNewComp(cid, startDate, endDate, compName, resourceId) {
      var editedComp = Restangular.all('editNewComp');
      return editedComp.getList({cid: cid, startDate: startDate, endDate: endDate, compName: compName, resourceId: resourceId});
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

    return {
      getComp: getComp,
      saveNewComp: saveNewComp,
      editNewComp: editNewComp,
      deleteComp: deleteComp,
      getSelectedComp: getSelectedComp,
      getSelectedCompCid: getSelectedCompCid,
      setSelectedComp: setSelectedComp
    };
  });
