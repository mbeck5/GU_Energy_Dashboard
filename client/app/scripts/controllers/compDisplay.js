'use strict';

angular.module('clientApp')
  .controller('CompDisplayCtrl', function ($scope, $location, $modal, compEditSvc) {
    var sortedComps = [];
    $scope.searchInput = '';
    $scope.filteredRunningComps = [];
    $scope.filteredPastComps = [];
    $scope.filteredUpcomingComps = [];
    $scope.tabActivity = [true, false, false];
    var selectedCompTimeline = 0;
    $scope.displayedCompIndex = 0;
    //$scope.selectedComp;

    //retrieve initial data
    refreshCompList();

    function sortCompsIntoTabs(allComps) {
      $scope.filteredRunningComps = [];
      $scope.filteredPastComps = [];
      $scope.filteredUpcomingComps = [];
      for (var i = 0; i < allComps.length; i++) {
        var today = new Date();
        if (moment(allComps[i].start_date).diff(today) < 0) {
          if (moment(allComps[i].end_date).diff(today) < 0) {
            $scope.filteredPastComps[$scope.filteredPastComps.length] = allComps[i];
          }
          else {
            $scope.filteredRunningComps[$scope.filteredRunningComps.length] = allComps[i];
          }
        }
        else {
          $scope.filteredUpcomingComps[$scope.filteredUpcomingComps.length] = allComps[i];
        }
      }
      sortedComps = [$scope.filteredRunningComps, $scope.filteredPastComps, $scope.filteredUpcomingComps];
      setSelectedTimeLine();
    }

    function setSelectedTimeLine () {
      selectedCompTimeline = $scope.tabActivity.indexOf(true);
    }

    //filters based on search input
    $scope.filterComps = function () {
      $scope.filteredComps = comps.filter(function(element) {
        return element.comp_name.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
      });
    };

    //when clicking on competition
    $scope.selectComp = function (index) {
      compEditSvc.getComp().then(function (data) {
        sortCompsIntoTabs(data);
        compEditSvc.setSelectedComp(sortedComps[selectedCompTimeline][index]);
        $scope.displayedCompIndex = index;
        setDates(index);
      });
    };

    function setDates(index) {
      sortedComps[selectedCompTimeline][index].start_date = moment(sortedComps[selectedCompTimeline][index].start_date).format('DD/MMMM/YYYY');
      sortedComps[selectedCompTimeline][index].end_date = moment(sortedComps[selectedCompTimeline][index].end_date).format('DD/MMMM/YYYY');
    }

    $scope.openCreateModal = function (size) {
      var createModal = $modal.open({
        templateUrl: 'myModalContent1.html',
        controller: 'createModalInstanceCtrl',
        size: size
      });

      createModal.result.then(function(created) {
        if (created)  //only refresh if user added new
          refreshCompList();
      });
    };

    $scope.openEditModal = function (size) {
      var editModal = $modal.open({
        templateUrl: 'myModalContent2.html',
        controller: 'editModalInstanceCtrl',
        size: size
      });

      editModal.result.then(function(edited) {
        if (edited)  //only refresh if user edited
          refreshCompList();
      });
    };

    $scope.openDeleteModal = function (size) {
      var deleteModal = $modal.open({
        templateUrl: 'myModalContent3.html',
        controller: 'deleteModalInstanceCtrl',
        size: size
      });

      deleteModal.result.then(function(deleted) {
        if (deleted) {  //only refresh if user deleted
          deleteCurrentItem();
        }
      });
    };

    //retrieves all competition info
    function refreshCompList() {
      compEditSvc.getComp().then(function (data) {
        $scope.searchInput = '';  //reset search
        sortCompsIntoTabs(data);
        $scope.displayedCompIndex = 0;
        compEditSvc.setSelectedComp(sortedComps[0][0]);
        $scope.selectedComp = sortedComps[0][0];
        setDates(0);
      });
    }

    //removes current item from front-end ui
    function deleteCurrentItem() {
      var index = comps.indexOf($scope.filteredComps[$scope.displayedCompIndex]); //find index
      comps.splice(index, 1); //remove item
      $scope.searchInput = '';  //reset search
      $scope.filteredComps = comps; //reset view
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

  //when ok is clicked
  $scope.ok = function (newName) {
    //check that they entered a name
    if (newName == '') {
      alert("Please specify a competition name");
    }
    else {
      //check for valid dates
      //check for valid dates
      if (moment(compEditSvc.getStartDate()).diff(moment(compEditSvc.getEndDate() < 0))) {
        alert("Invalid Date");
      }
      else {
        //get dates from service daved from datepicker controller
        var startDateStr = moment(compEditSvc.getStartDate()).format('YYYY/MM/DD');
        var endDateStr = moment(compEditSvc.getEndDate()).format('YYYY/MM/DD');
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
          compEditSvc.saveNewComp(maxCid, startDateStr, endDateStr, newName.replace("'", "''"));
          for (var property in $scope.checkedBuildings) {
            if ($scope.checkedBuildings.hasOwnProperty(property) && $scope.checkedBuildings[property]) {
              compEditSvc.addCompBuilding(maxCid, property);
            }
          }
          $modalInstance.close(true);
        }
      );
    }
  }

  //when cancel clicked
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  //get a new cid that does not exist yet
  $scope.getNewCid = function () {

  };

};

//controller for edit modal
angular.module('clientApp').controller('editModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc, buildingSvc) {
  //variables
  $scope.selectedResourceComp = 'Select Resource';
  $scope.selectedComp = compEditSvc.getSelectedComp();
  $scope.name = $scope.selectedComp.comp_name;
  $scope.startDate = $scope.selectedComp.start_date;
  $scope.endDate = $scope.selectedComp.end_date;
  var cid = $scope.selectedComp.cid;
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

  //when ok clicked
  $scope.ok = function (newName) {
    //check for valid name
    if (newName == '') {
      alert("Please specify a competition name");
    }
    else {
      //check for valid dates
      if (moment(compEditSvc.getStartDate()).diff(moment(compEditSvc.getEndDate() < 0))) {
        alert("Invalid Date");
      }
      else {
        //delete old buildings saved for the competition
        compEditSvc.deleteCompBuildings($scope.cid).then(function () {
          //get dates saved from service from datepicker
          var startDateStr = moment(compEditSvc.getStartDate()).format('YYYY/MM/DD');
          var endDateStr = moment(compEditSvc.getEndDate()).format('YYYY/MM/DD');
          //update in database
          compEditSvc.editNewComp(compEditSvc.getSelectedCompCid(), startDateStr, endDateStr, newName.replace("'", "''")).then(function () {
            //save new building selections
            compEditSvc.saveListOfBuildings($scope.checkedBuildings, $scope.cid);
          });
          $rootScope.$broadcast('updateCompList');
          $modalInstance.close();
          $rootScope.$broadcast('updateCompList');
        });
        $modalInstance.close(true);
      }
      }
    }
  });

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
