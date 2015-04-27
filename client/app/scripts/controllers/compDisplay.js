'use strict';

angular.module('clientApp')
  .controller('CompDisplayCtrl', function ($scope, $location, $modal, compEditSvc, usSpinnerService) {
    var sortedComps = {}; //past, running, upcoming
    var selectedComp;
    $scope.searchInput = {input: ''};
    $scope.filteredComps = {};   //past, running, upcoming
    $scope.compTabActivity = [false, true, false];  //past, running, upcoming
    $scope.compDisplayTabActivity = [false, true];  //podium, all
    $scope.displayedCompIndex = 0;
    $scope.spinnerActive = false;

    //retrieve initial data
    refreshCompList();

    function sortCompsIntoTabs(allComps) {
      sortedComps = {past: [], running: [], upcoming: []};  //reset
      for (var i = 0; i < allComps.length; ++i) {
        var today = new Date();
        if (moment(allComps[i].start_date).diff(today) < 0) {
          if (moment(allComps[i].end_date).diff(today) > 0) {
            sortedComps.running.push(allComps[i]);
          }
          else if (moment(allComps[i].end_date).diff(today) < 0) {
            sortedComps.past.push(allComps[i]);
          }
        }
        else {
          sortedComps.upcoming.push(allComps[i]);
        }
      }
      $scope.filteredComps = angular.copy(sortedComps);
    }

    //returns key to selectedTimeline associative array
    function getSelectedTimeline() {
      var index = $scope.compTabActivity.indexOf(true);
      switch (index) {
        case 0:
          return "past";
        case 1:
          return "running";
        case 2:
          return "upcoming";
      }
    }

    //return topThree buildings from service
    $scope.getTopThree = function () {
      return compEditSvc.getTopThree();
    };

    //filters based on search input
    $scope.filterComps = function () {
      $scope.filteredComps[getSelectedTimeline()] = sortedComps[getSelectedTimeline()].filter(function (element) {
        return element.comp_name.toLowerCase().indexOf($scope.searchInput.input.toLowerCase().trim()) > -1;
      });
      $scope.displayedCompIndex = -1; //deselect item on view
      $scope.selectComp(0);
    };

    //called when competition tab is clicked
    $scope.compTabClick = function () {
      $scope.filterComps();
      var index = $scope.compTabActivity.indexOf(true);
      switch (index) {
        case 0:
          $scope.compDisplayTabActivity = [true, false];
          break;
        case 1:
          $scope.compDisplayTabActivity = [false, true];
          break;
        case 2:
          $scope.compDisplayTabActivity = [false, true];
          break;
      }
    };

    //when clicking on competition
    $scope.selectComp = function (index) {
      $scope.spinnerActive = true;
      usSpinnerService.spin('spinner');
      compEditSvc.setTopThree(["","",""]);
      //don't select if nothing there
      if ($scope.filteredComps[getSelectedTimeline()].length > index) {
        $scope.displayedCompIndex = index;
        selectedComp = angular.copy($scope.filteredComps[getSelectedTimeline()][index]);  //make deep copy to avoid date issues
        setDates();
        compEditSvc.setSelectedComp(selectedComp);
      }
      else {
        selectedComp = null;
        $scope.displayedCompIndex = -1; //deselect item
      }
      $scope.spinnerActive = false;
      usSpinnerService.stop('spinner');
    };

    //converts dates to correct format
    function setDates() {
      selectedComp.start_date = moment(selectedComp.start_date).format('DD/MMMM/YYYY');
      selectedComp.end_date = moment(selectedComp.end_date).format('DD/MMMM/YYYY');
    }

    //opens create competition modal
    $scope.openCreateModal = function (size) {
      var createModal = $modal.open({
        templateUrl: 'myModalContent1.html',
        controller: 'createModalInstanceCtrl',
        size: size
      });

      //upon close of modal
      createModal.result.then(function (created) {
        if (created)  //only refresh if user added new
          refreshCompList();
      });
    };

    //opens edit competition modal
    $scope.openEditModal = function (size) {
      var editModal = $modal.open({
        templateUrl: 'myModalContent2.html',
        controller: 'editModalInstanceCtrl',
        size: size
      });

      //upon close of modal
      editModal.result.then(function (edited) {
        if (edited)  //only refresh if user edited
          refreshCompList();
      });
    };

    //opens delete competition modal
    $scope.openDeleteModal = function (size) {
      var deleteModal = $modal.open({
        templateUrl: 'myModalContent3.html',
        controller: 'deleteModalInstanceCtrl',
        size: size
      });

      //upon close of modal
      deleteModal.result.then(function (deleted) {
        if (deleted) {  //only refresh if user deleted
          $scope.searchInput.input = '';  //reset search
          deleteCurrentItem();
        }
      });
    };

    $scope.isCompetitionSelected = function() {
      return selectedComp != null;
    };

    //retrieves all competition info
    function refreshCompList() {
      $scope.searchInput.input = '';  //reset search
      compEditSvc.getComp().then(function (data) {
        sortCompsIntoTabs(data);
        $scope.selectComp(0);
      });
    }

    //removes current item from ui
    function deleteCurrentItem() {
      var selectedTimeline = getSelectedTimeline();
      var index = getOriginalIndex(selectedTimeline);
      sortedComps[selectedTimeline].splice(index, 1);
      $scope.filteredComps = sortedComps; //reset list
      $scope.selectComp(0); //select first comp in new list
    }

    //returns index of unfiltered array of selected comp in filtered
    function getOriginalIndex(selectedTimeline) {
      var id = $scope.filteredComps[selectedTimeline][$scope.displayedCompIndex].cid;
      for (var i = 0; i < sortedComps[selectedTimeline].length; ++i) {
        if (id === sortedComps[selectedTimeline][i].cid)
          return i;
      }
      return -1;
    }
  });

//controller for creating competition
angular.module('clientApp').controller('createModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc, buildingSvc) {
  //view variables
  $scope.name = '';
  $scope.checkedBuildings = [];
  $scope.buildings = [];
  $scope.title = "Create Competition";

  //get list of buildings
  buildingSvc.getBuildings().then(function (data) {
    $scope.buildings = data;
  });

  //get todays date and set date variables
  //save them initially to service if they dont change them
  $scope.startDate = moment().format('DD/MMMM/YYYY');
  compEditSvc.saveStartDate($scope.startDate);
  $scope.endDate = moment().add(2, 'weeks').format('DD/MMMM/YYYY');
  compEditSvc.saveEndDate($scope.endDate);

  $scope.status = {
    isopen: false
  };


  //toggle check value by clicking on item
  $scope.selectBuilding = function (index) {
    var id = $scope.buildings[index].id;
    if ($scope.checkedBuildings[id]) {
      $scope.checkedBuildings[id] = !$scope.checkedBuildings[id];
    }
    else {
      $scope.checkedBuildings[id] = true;
    }
  };

  //when ok is clicked
  $scope.ok = function (newName) {
    //check that they entered a name
    if (newName == '') {
      alert("Please specify a competition name");
    }
    else {
      var tempStart = compEditSvc.getStartDate();
      var tempEnd = compEditSvc.getEndDate();

      var startDateStrMoment = moment(tempStart, 'DD/MMMM/YYYY');//.format('YYYY/MM/DD');
      var endDateStrMoment = moment(tempEnd, 'DD/MMMM/YYYY');//.format('YYYY/MM/DD');

      var clickedBuildingCount = 0;
      for (var property in $scope.checkedBuildings) {
        if ($scope.checkedBuildings.hasOwnProperty(property) && $scope.checkedBuildings[property]) {
          clickedBuildingCount++;
        }
      }
      if (clickedBuildingCount < 3) {
        alert("3 or more buildings must be selected")
      }
      else {
        if (!(startDateStrMoment.diff(endDateStrMoment, 'days') < 1)) {
          alert("Invalid end date");
        }
        else {
          //get dates from service daved from datepicker controller
          var startDateStr = startDateStrMoment.format('YYYY/MM/DD');
          var endDateStr = endDateStrMoment.format('YYYY/MM/DD');

          //save the new competition to the database
          compEditSvc.getComp().then(function (data) {
            var maxCid = 0;
            var arrayLength = data.length;
            for (var i = 0; i < arrayLength; i++) {
              if (data[i].cid > maxCid) {
                maxCid = data[i].cid;
              }
            }
            maxCid = maxCid + 1;
            compEditSvc.saveNewComp(maxCid, startDateStr, endDateStr, newName.replace("'", "''")).then(function (data) {
              if (data === "OK") {
                for (var property in $scope.checkedBuildings) {
                  if ($scope.checkedBuildings.hasOwnProperty(property) && $scope.checkedBuildings[property]) {
                    compEditSvc.addCompBuilding(maxCid, property);
                  }
                }
              }
              $modalInstance.close(true);
            });
          });
        }
      }
    }
  };

  //when cancel clicked
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

//controller for edit modal
angular.module('clientApp').controller('editModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc, buildingSvc) {
  //variables
  $scope.selectedResourceComp = 'Select Resource';
  var selectedComp = compEditSvc.getSelectedComp();
  $scope.name = selectedComp.comp_name;
  $scope.startDate = selectedComp.start_date;
  $scope.endDate = selectedComp.end_date;
  var cid = selectedComp.cid;
  $scope.checkedBuildings = [];
  $scope.buildings = [];
  $scope.title = "Edit Competition";

  //get list of buildings
  compEditSvc.getCompBuildingList(cid).then(function (data) {
    for (var i = 0; i < data.length; i++) {
      $scope.checkedBuildings[data[i].bid] = true;
    }
  });

  //get list of buildings
  buildingSvc.getBuildings().then(function (data) {
    $scope.buildings = data;
    compEditSvc.saveStartDate($scope.startDate);
    compEditSvc.saveEndDate($scope.endDate);
  });

  //toggle check value by clicking on item
  $scope.selectBuilding = function (index) {
    var id = $scope.buildings[index].id;
    if ($scope.checkedBuildings[id]) {
      $scope.checkedBuildings[id] = !$scope.checkedBuildings[id];
    }
    else {
      $scope.checkedBuildings[id] = true;
    }
  };


  //when ok clicked
  $scope.ok = function (newName) {
    //check for valid name
    if (newName == '') {
      alert("Please specify a competition name");
    }
    else {
      var tempStart = compEditSvc.getStartDate();
      var tempEnd = compEditSvc.getEndDate();

      var startDateStrMoment = moment(tempStart, 'DD/MMMM/YYYY');//.format('YYYY/MM/DD');
      var endDateStrMoment = moment(tempEnd, 'DD/MMMM/YYYY');//.format('YYYY/MM/DD');

      var clickedBuildingCount = 0;
      for (var property in $scope.checkedBuildings) {
        if ($scope.checkedBuildings.hasOwnProperty(property) && $scope.checkedBuildings[property]) {
          clickedBuildingCount++;
        }
      }
      if (clickedBuildingCount < 3) {
        alert("3 or more buildings must be selected")
      }
      else {
        if (!(startDateStrMoment.diff(endDateStrMoment, 'days') < 1)) {
          alert("Invalid end date");
        }
        else {
          //delete old buildings saved for the competition
          compEditSvc.deleteCompBuildings(cid).then(function (data) {
            if (data === "OK") {
              //get dates saved from service from datepicker
              var startDateStr = startDateStrMoment.format('YYYY/MM/DD');
              var endDateStr = endDateStrMoment.format('YYYY/MM/DD');
              //update in database
              compEditSvc.editNewComp(compEditSvc.getSelectedCompCid(), startDateStr, endDateStr, newName.replace("'", "''")).then(function (data) {
                //save new building selections
                if (data === "OK") {
                  compEditSvc.saveListOfBuildings($scope.checkedBuildings, cid);
                }

                $modalInstance.close(true);
              });
            }
            else {
              $modalInstance.close(true);
            }
          });
        }
      }
    }
  };

  //on cancel click
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

//controller for delete modal
angular.module('clientApp').controller('deleteModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc) {

  //on ok
  $scope.ok = function () {
    //get the selected competition cid
    var currentCid = compEditSvc.getSelectedCompCid();
    //delete
    compEditSvc.deleteComp(currentCid);
    $modalInstance.close(true);
  };

  //on cancel
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

//controller for the datepicker
angular.module('clientApp').controller('DatepickerCtrl', function ($scope, compEditSvc) {
  //set the min date to be today
  $scope.minDate = moment().format('DD/MMMM/YYYY');

  $scope.close = function (date, isStart) {
    if (isStart) {
      compEditSvc.saveStartDate(date);
    }
    else {
      compEditSvc.saveEndDate(date);
    }
  };

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1
  };

  //watch function for when date text is changed
  $scope.saveDate = function (date, isStartDate) {
    //save start date
    if (isStartDate) {
      compEditSvc.saveStartDate(moment(date).format('DD/MMMM/YYYY'));
      $scope.minDate = moment(date).format('DD/MMMM/YYYY');
    }
    //save end date
    else {
      compEditSvc.saveEndDate(moment(date).format('DD/MMMM/YYYY'));
    }
  };
});
