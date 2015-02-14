'use strict';

angular.module('clientApp')
  .controller('CompDisplayCtrl', function ($scope, $location, $modal, compEditSvc, buildingSvc) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    var comps = [];
    $scope.searchInput = '';
    $scope.filteredComps = [];

    $scope.displayedCompIndex = 0;// = $scope.filterBuildings[0];

    //unpack promise returned from rest call
    compEditSvc.getComp().then(function (data) {
      $scope.filteredComps = data;
      compEditSvc.setSelectedComp($scope.filteredComps[0]);

      for(var i = 0; i < $scope.filteredComps.length; i++)
      {
        var tempDate = $scope.filteredComps[i].startDate;//.split("-");
        //tempDate = toString(tempDate).split("-");
        $scope.filteredComps[i].startDate = tempDate[2] + "/" + monthNames[tempDate[1]] + "/" + tempDate[0];

        tempDate = $scope.filteredComps[i].endDate;//.split("-");
        //tempDate = toString(tempDate).split("-");
        $scope.filteredComps[i].endDate = tempDate[2] + "/" + monthNames[tempDate[1]] + "/" + tempDate[0];
      }

      $scope.displayedCompIndex = index;
      console.log(data);
    });

    //filters based on search input
    $scope.filterComps = function () {
      $scope.filteredComps = buildings.filter(filterBuildings);
    };

    //when clicking on competition
    $scope.selectComp = function (index) {
      compEditSvc.setSelectedComp($scope.filteredComps[index]);
      $scope.displayedCompIndex = index;
    };

    $scope.openCreateModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent1.html',
        controller: 'createModalInstanceCtrl',
        size: size
      });
    };

    $scope.openEditModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent2.html',
        controller: 'editModalInstanceCtrl',
        size: size
      });
    };

    $scope.openDeleteModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent3.html',
        controller: 'deleteModalInstanceCtrl',
        size: size
      });
      modalInstance.result.then(function (result) {
        if (result != 'cancel') {
          compEditSvc.getComp().then(function (data) {
            $scope.filteredComps = data;
            compEditSvc.setSelectedComp($scope.filteredComps[0]);
            $scope.displayedCompIndex = index;
            console.log(data);
          });
        }
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

angular.module('clientApp').controller('createModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  $scope.checked = false;
  $scope.name = '';
  var today = new Date();
  var weekLater = new Date();
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()];
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  $scope.startDate = dd + '/' + mm + '/' + yyyy;
  compEditSvc.saveStartDate(dd + '/' + mm + '/' + yyyy);
  today.setDate(today.getDate() + 14);
  dd = today.getDate();
  mm = monthNames[today.getMonth()];
  yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  $scope.endDate = dd + '/' + mm + '/' + yyyy;
  compEditSvc.saveEndDate(dd + '/' + mm + '/' + yyyy);
  $scope.status = {
    isopen: false
  };

  $scope.ok = function (newName) {
    if (newName == '') {
      alert("Please specify a competition name");
    }
    else {
      if (Date.parse(compEditSvc.getStartDate()) == NaN || Date.parse(compEditSvc.getEndDate()) == NaN) {
        alert("Invalid Date");
      }
      else {
        var startDateStr = compEditSvc.getStartDate().split("/");
        var newStartDateStr = startDateStr[2] + '-' + (monthNames.indexOf(startDateStr[1]) + 1) + '-' + startDateStr[0];

        var endDateStr = compEditSvc.getEndDate().split("/");
        var newEndDateStr = endDateStr[2] + '-' + (monthNames.indexOf(endDateStr[1]) + 1) + '-' + endDateStr[0];

        var maxCid = 0;
        compEditSvc.getComp().then(function (data) {
          var arrayLength = data.length;
          for (var i = 0; i < arrayLength; i++) {
            //alert(data[i].cid);
            if (data[i].cid > maxCid) {
              maxCid = data[i].cid;
            }
          }
          maxCid = maxCid + 1;
          compEditSvc.saveNewComp(maxCid, newStartDateStr, newEndDateStr, newName.replace("'", "''"));
          $modalInstance.close();
        });
      }
    }

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

//rootscope broadcast

angular.module('clientApp').controller('editModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  $scope.selectedResourceComp = 'Select Resource';
  $scope.selectedComp = compEditSvc.getSelectedComp();
  $scope.name = $scope.selectedComp.comp_name;
  $scope.startDate = $scope.selectedComp.start_date;
  $scope.endDate = $scope.selectedComp.end_date;
  $scope.cid = $scope.selectedComp.cid;

  $scope.ok = function (newName) {
    if ($scope.name.trim() == '') {
      alert("Please specify a competition name");
    }
    else {
      var startDateStr = compEditSvc.getStartDate().split("/");
      var newStartDateStr = startDateStr[2] + '-' + (monthNames.indexOf(startDateStr[1]) + 1) + '-' + startDateStr[0];

      var endDateStr = compEditSvc.getEndDate().split("/");
      var newEndDateStr = endDateStr[2] + '-' + (monthNames.indexOf(endDateStr[1]) + 1) + '-' + endDateStr[0];

      compEditSvc.editNewComp(compEditSvc.getSelectedCompCid(), newStartDateStr, newEndDateStr, newName.replace("'", "''"));
      $modalInstance.close();
    }

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('clientApp').controller('deleteModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc) {

  $scope.ok = function () {
    var currentCid = compEditSvc.getSelectedCompCid();
    compEditSvc.deleteComp(currentCid);
    $modalInstance.dismiss('ok');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

angular.module('clientApp').controller('DatepickerDemoCtrl', function ($scope, compEditSvc) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  today = mm + '/' + dd + '/' + yyyy;
  $scope.minDate = dd + '/' + mm + '/' + yyyy;
  $scope.maxDate = dd + '/' + mm + '/' + (yyyy + 1);
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
    $scope.minDate = mm + '/' + dd + '/' + yyyy;
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

  $scope.saveDate = function (date, isStartDate) {
    var year = date.getFullYear();
    var day = date.getDate();//getDay();
    var month = monthNames[date.getMonth()];
    if (day < 10) {
      day = '0' + dd
    }
    if (isStartDate) {
      compEditSvc.saveStartDate(day + '/' + month + '/' + year);
    }
    else {
      compEditSvc.saveEndDate(day + '/' + month + '/' + year);
    }
  }

  $scope.formats = ['dd/MMMM/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
});

