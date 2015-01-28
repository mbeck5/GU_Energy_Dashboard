'use strict';

angular.module('clientApp')
  .controller('CompDisplayCtrl', function ($scope, $location, buildingSvc) {
    var buildings;
    var comp1 = ['Competition 1', 'Goller', 'Dillon', 'Gas', '1/15/2015', '3/12/2015'];
    var comp2 = ['Competition 2', 'BARC', 'Burch', 'Electricty', '1/17/2015', '4/15/2015'];
    var comp3 = ['Competition 3', 'Alliance', 'Campion', 'Gas', '4/12/2015', '2/15/2015'];
    var comp4 = ['Competition 4', 'Chardin', 'COG', 'Water', '2/1/2015', '5/15/2015'];
    var comp5 = ['Competition 5', 'Cushing', 'Desmet', 'Electricity', '1/20/2015', '2/10/2015'];
    $scope.searchInput = '';
    $scope.filteredBuildings = [comp1, comp2, comp3, comp4, comp5];

    $scope.displayedCompIndex = 0;// = $scope.filterBuildings[0];

    //filters based on search input
    $scope.filterBuildings = function () {
      $scope.filteredBuildings = buildings.filter(filterBuildings);
    };

    //when clicking on building
    $scope.selectBuilding = function (index) {
      buildingSvc.setSelectedBuilding($scope.filteredBuildings[index]);
      $scope.displayedCompIndex = index;
    };

    //can't have '/' in url
    $scope.returnCorrectName = function (index) {
      return $scope.filteredBuildings[index].name.replace("/", "--");
    };

    function filterBuildings(element) {
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
        useInteractiveGuideline:true,
        xAxis: {
          axisLabel: 'Time',
          showMaxMin: false,
          tickFormat: function(d) {
            return d3.time.format('%m/%d/%y')(new Date(d));
          }
        },
        x2Axis: {
          showMaxMin: false,
          tickFormat: function(d) {
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

    function createGraphData(data){
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

angular.module('clientApp').controller('ModalDemoCtrl', function ($scope, $modal, $log) {
  $scope.items = ['item1', 'item2', 'item3'];
  $scope.open = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('clientApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
