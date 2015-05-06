'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, $location, $timeout, buildingSvc, usSpinnerService) {
    var selectedResource = 2; //default resource
    var colorMap = {2: '#FFCC00', 3: '#F20000', 7: '#1F77B4'};
    var tempData = [];
    var isDetailed = true;  //used by code
    $scope.isDetailed = true; //for gui
    $scope.date1 = moment().subtract(1, 'years').format('DD/MMMM/YYYY'); //default start is one year ago
    $scope.date2 = moment().format('DD/MMMM/YYYY');
    $scope.dateOpen1 = false;
    $scope.dateOpen2 = false;
    $scope.selectedBuildings = buildingSvc.getSelectedBuildings();
    $scope.spinnerActive = false;
    $scope.isDatesChanged = false;  //toggles when date inputs are changed

    checkRefresh(); //ensures user is navigating directly to comparison page
    getBuildingData(null);  //initial call to get data of default type

    //graph data
    $scope.data = [];

    //graph configuration
    $scope.options = {
      chart: {
        type: 'lineChart',
        height: 600,
        margin: {
          left: 65
        },
        xAxis: {
          axisLabel: 'Date',
          showMaxMin: false,
          tickFormat: function (d) {
            return d3.time.format('%m/%d/%y')(new Date(d));
          }
        },
        yAxis: {
          axisLabel: 'kWh', //will change with resource toggle
          showMaxMin: false,
          axisLabelDistance: 25,
          tickPadding: [10]
        },
        lines: {
          forceY: [0]
        },
        tooltips: true,
        transitionDuration: 500,
        useInteractiveGuideline: true,
        noData: ''
      },
      title: {
        enable: true,
        text: 'Daily Electricity Usage'
      }
    };

    //resource toggle
    $scope.selectResource = function (resourceType) {
      //don't need to reselect if already select
      if (resourceType != selectedResource) {
        resetData();
        selectedResource = resourceType;
        getBuildingData();
      }
    };

    //when date inputs have been changed
    $scope.datesChanged = function () {
      $scope.isDatesChanged = true;
    };

    //when user toggles toggle
    $scope.toggleDetailed = function () {
      isDetailed = !isDetailed;
      $scope.applyGraphOptions();
    };

    //applies toggle and date filter options and retrieves new data
    $scope.applyGraphOptions = function () {
      $scope.isDatesChanged = false;
      checkIfEqual();
      resetData();
      getBuildingData();
    };

    //toggles date picker visibility
    $scope.openDate = function ($event, val) {
      $event.preventDefault();
      $event.stopPropagation();
      if (val === 1) {
        $scope.dateOpen1 = true;
      }
      else {
        $scope.dateOpen2 = true;
      }
    };

    //checks if user has selected the same date in both date pickers
    //and automatically increments the "To" date by one day
    function checkIfEqual() {
      //convert back to moment objects
      if (moment.isDate($scope.date1))
        $scope.date1 = moment($scope.date1);
      else  //string
        $scope.date1 = moment($scope.date1, 'DD/MMMM/YYYY');

      if (moment.isDate($scope.date2))
        $scope.date2 = moment($scope.date2);
      else  //string
        $scope.date2 = moment($scope.date2, 'DD/MMMM/YYYY');


      //if dates are equal date 2 += 1 because user doesn't understand
      if (moment($scope.date1).isSame($scope.date2)) {
        $scope.date2 = moment($scope.date2).add(1, 'day').format('DD/MMMM/YYYY'); // +1 day
      }
      else {
        $scope.date2 = $scope.date2.format('DD/MMMM/YYYY'); //else, just convert to string
      }

      $scope.date1 = moment($scope.date1).format('DD/MMMM/YYYY'); //convert back to string
    }

    //cleans data return from server to graph compatible format
    function createGraphData(data) {
      var values = [];
      var buildingName = '';
      if (typeof data[0] !== 'undefined') {
        buildingName = data[0].name;
      }

      if (data) {
        //create graph points
        values = new Array(data.length);
        for (var j = 0; j < data.length; j++) {
          values[j] = {x: Date.parse(data[j].date), y: Math.round(data[j].consumption)};
        }
      }
      tempData.push({values: values, key: buildingName});

      //postpone graph initialization until all points have been created
      if (tempData.length === $scope.selectedBuildings.length) {
        replaceMissingBuildingNames();
        initGraph();
      }
    }

    //replaces the labels of buildings that would otherwise be missing in comparision graphs
    //due to them having no data
    function replaceMissingBuildingNames(){
      //get a temp list of all selected names
      var selectedBuildingNames = [];
      for(var j = 0; j < $scope.selectedBuildings.length; j++) {
        selectedBuildingNames.push($scope.selectedBuildings[j].name);
      }
      //remove any name that is already labeled
      for (var j = 0; j < tempData.length; j++) {
        for (var x = 0; x < selectedBuildingNames.length; x++) {
          if (tempData[j].key == selectedBuildingNames[x])
            selectedBuildingNames[x] = "";
        }
      }
      for(var i = 0; i < tempData.length; i++) {
        if (tempData[i].key == "") {
          //choose from one of the names that are left
          //order doesnt matter because they have no data and
          //will not be displayed anyway
          for (var j = 0; j < selectedBuildingNames.length; j++) {
            if (selectedBuildingNames[j] != "") {
              tempData[i].key = selectedBuildingNames[j];
              selectedBuildingNames[j] = "";
              break;
            }
          }
        }
      }
    }

    //retrieves data from server
    function getBuildingData(index) {
      $scope.spinnerActive = true;
      usSpinnerService.spin('spinner');
      var i = 0;
      var stopCondition = $scope.selectedBuildings.length;
      if (index != null) {
        i = index;
        stopCondition = i + 1;
      }
      for (i; i < stopCondition; i++) {
        //if going to building page directly or refreshing, steal name from url (basically a hack)
        if (typeof $scope.selectedBuildings[0].id === 'undefined') {
          var tempName = $location.path().replace('/buildings/', '').replace('--', '/');
          $scope.selectedBuildings[i] = {};
          $scope.selectedBuildings[i].name = tempName;

          //get resource info for building from name rather than ID
          buildingSvc.getBuildingDataFromName(tempName, selectedResource, isDetailed, $scope.date1, $scope.date2).then(function (data) {

            createGraphData(data);
          });
        }

        //if coming from the building select page
        else {
          //get resource info for building
          buildingSvc.getBuildingData($scope.selectedBuildings[i].id, selectedResource, isDetailed, $scope.date1, $scope.date2).then(function (data) {

            createGraphData(data);

          });
        }
      }
    }

    //called once data is retrieved
    function initGraph() {
      var longestLabel;
      $scope.data = tempData;
      //If there is no data for the selected resource, say so.
      if($scope.data[0].values.length == 0){
        $scope.options.chart.noData = 'No Data Available for Selected Resource';
      }
      setResourceLabel();
      $scope.options.chart.lines.forceY = [0, getMaxPlusPadding(10)];
      longestLabel = getMaxPlusPadding(10).toFixed().toString().length;
      $scope.options.chart.yAxis.axisLabelDistance = 25 - longestLabel;
      $scope.spinnerActive = false;
      usSpinnerService.stop('spinner');
    }

    function setResourceLabel() {
      $scope.data[0].color = colorMap[selectedResource];
      switch (selectedResource) {
        case 2:
          $scope.options.chart.yAxis.axisLabel = 'kWh';
          if (isDetailed) {
            $scope.options.title.text = 'Daily Electricity Usage';
          }
          else {
            $scope.options.title.text = 'Monthly Electricity Usage';
          }
          break;
        case 3:
          $scope.options.chart.yAxis.axisLabel = 'kBTU';
          if (isDetailed) {
            $scope.options.title.text = 'Daily Gas Usage';
          }
          else {
            $scope.options.title.text = 'Monthly Gas Usage';
          }
          break;
        case 7:
          $scope.options.chart.yAxis.axisLabel = 'Water';
          if (isDetailed) {
            $scope.options.title.text = 'Daily Water Usage';
          }
          else {
            $scope.options.title.text = 'Monthly Water Usage';
          }
          break;
        default:
          $scope.options.chart.yAxis.axisLabel = 'Whatever';
          if (isDetailed) {
            $scope.options.title.text = 'Daily Whatever Usage';
          }
          else {
            $scope.options.title.text = 'Monthly Whatever Usage';
          }
          break;
      }
    }

    //if routing directing to comparison, go back home
    function checkRefresh() {
      if (buildingSvc.getSelectedBuildings()[0] === 'DESELECTED' && $location.path() === '/comparison') {
        $location.path('/');
      }
    }

    //Returns the max y value of all datasets in $scope.data
    function getMaxPlusPadding(denom) {
      var max = 0;
      for (var i = 0; i < $scope.selectedBuildings.length; i++) {
        if ($scope.data[i]) {
          var data = $scope.data[i].values;
          for (var j = 0; j < data.length; j++) {
            if (data[j].y > max) {
              max = data[j].y;
            }
          }
        }
      }
      var padding = 0;
      if (denom === -1) {
        padding = 0;
      }
      else {
        padding = max / denom;
      }
      return max + padding;
    }

    //clears all data
    function resetData() {
      $scope.data = [];
      tempData = [];
      $scope.options.chart.noData = '';
    }
  });
