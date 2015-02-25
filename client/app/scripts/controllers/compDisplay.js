'use strict';

angular.module('clientApp')
  .controller('CompDisplayCtrl', function ($scope, $location, $modal, compEditSvc, buildingSvc) {
    var comps = [];
    $scope.searchInput = '';
    $scope.filteredComps = [];
    $scope.displayedCompIndex = 0;
    $scope.selectedComp;

    //unpack promise returned from rest call
    compEditSvc.getComp().then(function (data) {
      comps = data;
      $scope.filteredComps = data;
      $scope.displayedCompIndex = 0;
      compEditSvc.setSelectedComp($scope.filteredComps[0]);
      $scope.selectedComp = $scope.filteredComps[0];
      $scope.setDates(0);
    });

    $scope.$on('updateCompList', function (event, mass) {
      compEditSvc.getComp().then(function (data) {
        comps = data;
        $scope.filteredComps = data;
        $scope.displayedCompIndex = 0;
        compEditSvc.setSelectedComp($scope.filteredComps[0]);
        $scope.selectedComp = $scope.filteredComps[0];
        $scope.setDates(0);
      });
    });

    //filters based on search input
    $scope.filterComps = function () {
      $scope.filteredComps = comps.filter(filterComps);
    };

    //when clicking on competition
    $scope.selectComp = function (index) {
      compEditSvc.setSelectedComp($scope.filteredComps[index]);
      $scope.displayedCompIndex = index;
      $scope.setDates(index);
    };

    $scope.setDates = function (index) {
      $scope.filteredComps[index].start_date = moment($scope.filteredComps[index].start_date).format('DD/MMMM/YYYY');
      $scope.filteredComps[index].end_date = moment($scope.filteredComps[index].end_date).format('DD/MMMM/YYYY');
    }

    $scope.openCreateModal = function (size) {
      $modal.open({
        templateUrl: 'myModalContent1.html',
        controller: 'createModalInstanceCtrl',
        size: size
      });
    };

    $scope.openEditModal = function (size) {
      $modal.open({
        templateUrl: 'myModalContent2.html',
        controller: 'editModalInstanceCtrl',
        size: size
      });
    };

    $scope.openDeleteModal = function (size) {
      $modal.open({
        templateUrl: 'myModalContent3.html',
        controller: 'deleteModalInstanceCtrl',
        size: size
      });
    };

    //can't have '/' in url
    $scope.returnCorrectName = function (index) {
      return $scope.filteredComps[index].name.replace("/", "--");
    };

    function filterComps(element) {
      return element.name.toLowerCase().indexOf($scope.searchInput.toLowerCase().trim()) > -1;
    }

    var buildingScrollHeight = $(window).height() * .70;
    $('.scroll').css({'height': buildingScrollHeight + 'px'});

    var selectedResource = 2; //default resource
    var savedData = [];  //save downloaded data to avoid downloading

    $scope.selectedBuilding = 'goller';
    getBuildingData();  //initial call to get data of default type

    $scope.data = [{
      values: [{}],
      key: $scope.selectedBuilding
    }];

    $scope.options = {
      chart: {
        type: 'lineWithFocusChart',
        height: 600,
        margin: {
          top: 30,
          right: 75,
          bottom: 50,
          left: 75
        },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'Time',
          showMaxMin: false,
          tickFormat: function (d) {
            return d3.time.format('%m/%d/%y')(new Date(d));
          }
        },
        x2Axis: {
          showMaxMin: false,
          tickFormat: function (d) {
            return d3.time.format('%m/%y')(new Date(d));
          }
        },
        yAxis: {
          axisLabel: 'Electricity', //will change with resource toggle
          showMaxMin: false,
          axisLabelDistance: 25,
          tickPadding: [10]
        },
        y2Axis: {
          tickValues: 0,
          showMaxMin: false
        },
        lines: {
          forceY: [0]
        },
        transitionDuration: 500,
        noData: "No Data Available for Selected Resource"
      },
      title: {
        enable: true,
        text: "Daily Electricity Usage"
      }
    };

    function createGraphData(data) {
      //reset
      $scope.data[0].values = [];

      //create graph points
      for (var i = 0; i < data.length; i++) {
        $scope.data[0].values.push({x: Date.parse(data[i].date), y: data[i].consumption});
      }
    }

    function getBuildingData() {
      //get resource info for building
      buildingSvc.getBuildingData(45, selectedResource).then(function (data) {
        savedData[selectedResource] = data;
        initGraph();
      });
    }

    //called once data is retrieved
    function initGraph() {
      createGraphData(savedData[selectedResource]);
      setResourceLabel();
      setFocusArea();
    }

    function setResourceLabel() {
      switch (selectedResource) {
        case 2:
          $scope.options.chart.yAxis.axisLabel = 'Electricity';
          $scope.options.title.text = 'Daily Electricity Usage';
          break;
        case 3:
          $scope.options.chart.yAxis.axisLabel = 'Gas';
          $scope.options.title.text = 'Daily Gas Usage';
          break;
        default:
          $scope.options.chart.yAxis.axisLabel = 'Whatever';
          $scope.options.title.text = 'Daily Whatever Usage';
          break;
      }
    }

    //sets initial "zoom" view over specified area
    function setFocusArea() {
      $scope.$apply();

      //creating focus coordinates
      var curDate = new Date();
      var prevDate = new Date();
      curDate.setMonth(curDate.getMonth() - 4);   //TODO: change to real values later
      prevDate.setMonth(prevDate.getMonth() - 5);

      var chart = $scope.api.getScope().chart;  //get chart from view
      chart.brushExtent([prevDate, curDate]);
      $scope.api.update();
    }

  });

//controller for creating competition
angular.module('clientApp').controller('createModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, compEditSvc, buildingSvc) {
  //view variables
  $scope.checked = false;
  $scope.name = '';
  $scope.checkedBuildings = [];
  var buildings = [];
  $scope.searchInput = '';
  $scope.buildingTypes = [];
  $scope.filteredBuildings = [];
  $scope.title = "Create Competition";

  //get list of buildings
  buildingSvc.getBuildings().then(function (data) {
    buildings = data;
    $scope.filteredBuildings = buildings;
  });

  //get todays date and set date variables
  //save them initially to service if they dont change them
  var today = new Date();
  $scope.startDate = moment(today).format('DD/MMMM/YYYY');
  compEditSvc.saveStartDate($scope.startDate);
  $scope.endDate = moment(today).add(2, 'weeks').format('DD/MMMM/YYYY');
  compEditSvc.saveEndDate($scope.endDate);

  $scope.status = {
    isopen: false
  };

  //when ok is clicked
  $scope.ok = function (newName) {
    //check that they entered a name
    if (newName == '') {
      alert("Please specify a competition name");
      var count = 0;
    }
    else {
      //check for valid dates
      //if (Date.parse(compEditSvc.getStartDate()) == NaN || Date.parse(compEditSvc.getEndDate()) == NaN) {
      //  alert("Invalid Date");
      // }
      //else {
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
        $rootScope.$broadcast('updateCompList');
        $modalInstance.close();
        $rootScope.$broadcast('updateCompList');
      });
      // }
    }
  };

  //when cancel clicked
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  //get a new cid that does not exist yet
  $scope.getNewCid = function () {

  };

});

//controller for edit modal
angular.module('clientApp').controller('editModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, compEditSvc, buildingSvc) {
  //variables
  $scope.selectedResourceComp = 'Select Resource';
  $scope.selectedComp = compEditSvc.getSelectedComp();
  $scope.name = $scope.selectedComp.comp_name;
  $scope.startDate = $scope.selectedComp.start_date;
  $scope.endDate = $scope.selectedComp.end_date;
  $scope.cid = $scope.selectedComp.cid;
  $scope.checkedBuildings = [];
  $scope.checkedBuildingsSaved = [];
  var buildings = [];
  $scope.searchInput = '';
  $scope.buildingTypes = [];
  $scope.filteredBuildings = [];
  $scope.title = "Edit Competition";

  //get list of buildings
  compEditSvc.getCompBuildingList($scope.cid).then(function (data) {
    for (var i = 0; i < data.length; i++) {
      //for (var j = 0; j < data.length; j++) {
      //if ($scope.checkedBuildings[i] ==)
      $scope.checkedBuildings[data[i].bid] = true;
      // }
    }
  });

  //get list of buildings
  buildingSvc.getBuildings().then(function (data) {
    buildings = data;
    $scope.filteredBuildings = buildings;
    //$scope.checkedBuildingsSaved = compEditSvc.getCompBuildingList($scope.cid);
    compEditSvc.saveStartDate($scope.startDate);
    compEditSvc.saveEndDate($scope.endDate);
  });

  //when ok clicked
  $scope.ok = function (newName) {
    //check for valid name
    if ($scope.name.trim() == '') {
      alert("Please specify a competition name");
    }
    else {
      //delete old buildings saved for the competition
      compEditSvc.deleteCompBuildings($scope.cid).then(function () {
        //get dates saved from service from datepicker
        var startDateStr = moment(compEditSvc.getStartDate()).format('YYYY/MM/DD');
        var endDateStr = moment(compEditSvc.getEndDate()).format('YYYY/MM/DD');
        //update in database
        compEditSvc.editNewComp(compEditSvc.getSelectedCompCid(), startDateStr, endDateStr, newName.replace("'", "''")).then(function(){
          //save new building selections
          compEditSvc.saveListOfBuildings($scope.checkedBuildings, $scope.cid);
        });
        $rootScope.$broadcast('updateCompList');
        $modalInstance.close();
        $rootScope.$broadcast('updateCompList');
      });
    }

  };

  //on cancel click
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

//controller for delete modal
angular.module('clientApp').controller('deleteModalInstanceCtrl', function ($scope, $rootScope, $modalInstance, compEditSvc) {

  //on ok
  $scope.ok = function () {
    //get the selected competition cid
    var currentCid = compEditSvc.getSelectedCompCid();
    //delete
    compEditSvc.deleteComp(currentCid);
    $rootScope.$broadcast('updateCompList');
    $modalInstance.dismiss('ok');
    $rootScope.$broadcast('updateCompList');
  };

  //on cancel
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

//controller for the datepicker
angular.module('clientApp').controller('DatepickerDemoCtrl', function ($scope, compEditSvc) {
  var today = new Date();
  //set the min date to be today
  $scope.minDate = moment(today).format('DD/MMMM/YYYY');
  $scope.today = function () {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.close = function (date, isStart) {
    if (isStart) {
      compEditSvc.saveStartDate(date);
    }
    else {
      compEditSvc.saveEndDate(date);
    }
  };

  // Disable weekend selection
  $scope.disabled = function (date, mode) {
    //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function () {
    //$scope.minDate = mm + '/' + dd + '/' + yyyy;
  };
  $scope.toggleMin();

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();
    //$scope.close-on-date-selection = false;
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
  }

  $scope.formats = ['dd/MMMM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
});

