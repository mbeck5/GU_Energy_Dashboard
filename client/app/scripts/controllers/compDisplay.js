'use strict';

angular.module('clientApp')
  .controller('CompDisplayCtrl', function ($scope, $location, $modal, compEditSvc, buildingSvc) {
    var comps = [];
    $scope.searchInput = '';
    $scope.filteredComps = [];

    $scope.displayedCompIndex = 0;// = $scope.filterBuildings[0];

    //unpack promise returned from rest call
    compEditSvc.getComp().then(function (data) {
      $scope.filteredComps = data;
      compEditSvc.setSelectedComp($scope.filteredComps[0]);
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
        if(result != 'cancel')
        {
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

/*
angular.module('clientApp').controller('CreateModalCtrl', function ($scope, $modal, $log, compEditSvc) {
  $scope.items = ['item1', 'item2', 'item3'];
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  $scope.checked = false;
  $scope.selectedResourceComp = 'Select Resource';
  $scope.name = '';
  var today = new Date();
  var weekLater = new Date();
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()];
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  $scope.startDate = yyyy + '-' + mm + '-' + dd;
  today.setDate(today.getDate() + 14);
  dd = today.getDate();
  mm = monthNames[today.getMonth()];
  yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  $scope.endDate = yyyy + '-' + mm + '-' + dd;

  $scope.open = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent1.html',
      controller: 'createModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        },
        compName: function () {
          return $scope.name;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


  $scope.status = {
    isopen: false
  };

  $scope.toggled = function (open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };


  $scope.resourceClick = function (resource) {
    $scope.selectedResourceComp = resource;
  };

  $scope.okButton = function () {
    //if($scope.selectedResourceComp == 'Select Resource')
    //{
    //  alert("Please select a resource");
    //}
    if ($scope.name == '') {
      alert("Please specify a competition name");
    }
    else {
      //{
      var resourceId = 1;
      if ($scope.selectedResourceComp == 'Electricity') {
        resourceId = 2;
      }
      if ($scope.selectedResourceComp == 'Gas') {
        resourceId = 3;
      }
      if ($scope.selectedResourceComp == 'Water') {
        resourceId = 7;
      }
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
        compEditSvc.saveNewComp(maxCid, $scope.startDate, $scope.endDate, $scope.name, resourceId);
        $modal.close($scope.selected.item);
      });
    }

  };

  $scope.cancelButton = function () {
    $scope.dismiss('cancel');
  };

});
*/
angular.module('clientApp').controller('createModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  $scope.checked = false;
  $scope.selectedResourceComp = 'Select Resource';
  $scope.name = '';
  var today = new Date();
  var weekLater = new Date();
  var dd = today.getDate();
  var mm = monthNames[today.getMonth()];
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  $scope.startDate = yyyy + '-' + mm + '-' + dd;
  today.setDate(today.getDate() + 14);
  dd = today.getDate();
  mm = monthNames[today.getMonth()];
  yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  $scope.endDate = yyyy + '-' + mm + '-' + dd;

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function (open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };


  $scope.resourceClick = function (resource) {
    $scope.selectedResourceComp = resource;
  };

  $scope.ok = function (newName, newStartDate, newEndDate) {
    //if($scope.selectedResourceComp == 'Select Resource')
    //{
    //  alert("Please select a resource");
    //}
    if (newName == '') {
      alert("Please specify a competition name");
    }
    else {
      //{
      var resourceId = 1;
      if ($scope.selectedResourceComp == 'Electricity') {
        resourceId = 2;
      }
      if ($scope.selectedResourceComp == 'Gas') {
        resourceId = 3;
      }
      if ($scope.selectedResourceComp == 'Water') {
        resourceId = 7;
      }
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
        compEditSvc.saveNewComp(maxCid, newStartDate, newEndDate, newName, resourceId);
        $modalInstance.close();
      });
    }

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

//rootscope broadcast

angular.module('clientApp').controller('editModalInstanceCtrl', function ($scope, $modalInstance, compEditSvc) {
  $scope.selectedResourceComp = 'Select Resource';
  $scope.selectedComp = compEditSvc.getSelectedComp();
  $scope.name = $scope.selectedComp.comp_name;
  $scope.startDate = $scope.selectedComp.start_date;
  $scope.endDate = $scope.selectedComp.end_date;
  $scope.cid = $scope.selectedComp.cid;

  $scope.ok = function (newName, newStartDate, newEndDate) {
    if ($scope.name.trim() == '') {
      alert("Please specify a competition name");
    }
    else {
      var resourceId = 1;
      if ($scope.selectedResourceComp == 'Electricity') {
        resourceId = 2;
      }
      if ($scope.selectedResourceComp == 'Gas') {
        resourceId = 3;
      }
      if ($scope.selectedResourceComp == 'Water') {
        resourceId = 7;
      }
      compEditSvc.editNewComp(compEditSvc.getSelectedCompCid(), newStartDate, newEndDate, newName, resourceId);
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

angular.module('clientApp').controller('DatepickerDemoCtrl', function ($scope) {
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
  $scope.minDate = mm + '/' + dd + '/' + yyyy;
  $scope.minDate = mm + '/' + dd + '/' + (yyyy + 2);
  $scope.today = function () {

    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function (date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function () {
    //$scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
});

