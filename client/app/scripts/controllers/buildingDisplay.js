'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, $location, $timeout, buildingSvc, usSpinnerService) {
      var selectedResource = 2; //default resource
      var colorMap = {2: '#FFCC00', 3: '#F20000', 7: '#1F77B4'};
      var tempData = [];
      $scope.isDetailed = true; //detailed toggle value
      $scope.date1 = moment().subtract(1, 'years').format('DD-MMMM-YYYY'); //default start is one year ago
      $scope.date2 = moment().format('DD-MMMM-YYYY');
      $scope.dateOpen1 = false;
      $scope.dateOpen2 = false;
      $scope.selectedBuildings = buildingSvc.getSelectedBuildings();
      $scope.spinnerActive = false;

      checkRefresh();
      getBuildingData(null);  //initial call to get data of default type

      $scope.data = [];

      $scope.options = {
        chart: {
          type: 'lineChart',
          height: 600,
          xAxis: {
            axisLabel: 'Date',
            showMaxMin: false,
            tickFormat: function(d) {
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
            forceY:[0]
          },
          tooltips: true,
          transitionDuration: 500,
          useInteractiveGuideline: true,
          noData: 'No Data Available for Selected Resource'
        },
        title: {
          enable: true,
          text: 'Daily Electricity Usage'
        }
      };

      $scope.selectResource = function (resourceType) {
        resetData();
        selectedResource = resourceType;
        for(var i = 0; i < $scope.selectedBuildings.length; i++) {
          getBuildingData(i);
        }
      };

      //applies toggle and date filter options and retrieves new data
      $scope.applyGraphOptions = function() {
        resetData();
        getBuildingData();
      };

      //toggles date picker visibility
      $scope.openDate = function($event, val) {
        $event.preventDefault();
        $event.stopPropagation();
        if (val === 1) {
          $scope.dateOpen1 = true;
        }
        else {
          $scope.dateOpen2 = true;
        }
      };

      //Changed this to just push to temporary data variable.
      function createGraphData(data){
        var values = [];

        if (data) {
          //create graph points
          values = new Array(data.length);
          for (var j = 0; j < data.length; j++) {
            values[j] = {x: Date.parse(data[j].date), y: data[j].consumption};
          }
        }
        tempData.push({values: values, key: ''});

        //postpone graph initialization until all points have been created
        if(tempData.length === $scope.selectedBuildings.length){
          initGraph();
        }
      }

      function getBuildingData(index) {
        $scope.spinnerActive = true;
        usSpinnerService.spin('spinner');
        var i = 0;
        var stopCondition = $scope.selectedBuildings.length;
        if(index != null){
          i = index;
          stopCondition = i + 1;
        }
        for(i; i < stopCondition; i++) {
          //if going to building page directly or refreshing, steal name from url (basically a hack)
          if (typeof $scope.selectedBuildings[0].id === 'undefined') {
            var tempName = $location.path().replace('/buildings/', '').replace('--', '/');
            $scope.selectedBuildings[i] = {};
            $scope.selectedBuildings[i].name = tempName;

            //get resource info for building from name rather than ID
            buildingSvc.getBuildingDataFromName(tempName, selectedResource, $scope.isDetailed, $scope.date1, $scope.date2).then(function (data) {
              createGraphData(data);
            });
          }

          //if coming from the building select page
          else {
            //get resource info for building
            buildingSvc.getBuildingData($scope.selectedBuildings[i].id, selectedResource, $scope.isDetailed, $scope.date1, $scope.date2).then(function (data) {
              createGraphData(data);
            });
          }
        }
      }

      //called once data is retrieved
      function initGraph() {
        $scope.data = tempData;
        setKeys();
        setResourceLabel();
        $scope.options.chart.lines.forceY = [0, getMaxPlusPadding(10)];
        $scope.spinnerActive = false;
        usSpinnerService.stop('spinner');
      }

      //to set the keys for the lines when making multiple lines in a graph. probably bad.
      function setKeys(){
        for(var i = 0; i < $scope.selectedBuildings.length; i++){
          if($scope.data[i]) {
            $scope.data[i].key = $scope.selectedBuildings[i].name;
          }
        }
      }

      function setResourceLabel() {
        $scope.data[0].color = colorMap[selectedResource];
        switch (selectedResource) {
          case 2:
            $scope.options.chart.yAxis.axisLabel = 'kWh';
            if($scope.isDetailed) {
              $scope.options.title.text = 'Daily Electricity Usage';
            }
            else{
              $scope.options.title.text = 'Monthly Electricity Usage';
            }
            break;
          case 3:
            $scope.options.chart.yAxis.axisLabel = 'kBTU';
            if($scope.isDetailed) {
              $scope.options.title.text = 'Daily Gas Usage';
            }
            else{
              $scope.options.title.text = 'Monthly Gas Usage';
            }
            break;
          case 7:
            $scope.options.chart.yAxis.axisLabel = 'Water';
            if($scope.isDetailed) {
              $scope.options.title.text = 'Daily Water Usage';
            }
            else{
              $scope.options.title.text = 'Monthly Water Usage';
            }
            break;
          default:
            $scope.options.chart.yAxis.axisLabel = 'Whatever';
            if($scope.isDetailed) {
              $scope.options.title.text = 'Daily Whatever Usage';
            }
            else{
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
      function getMaxPlusPadding(denom){
        var max = 0;
        for(var i = 0; i < $scope.selectedBuildings.length; i++){
          if($scope.data[i]) {
            var data = $scope.data[i].values;
            for (var j = 0; j < data.length; j++) {
              if (data[j].y > max) {
                max = data[j].y;
              }
            }
          }
        }
        var padding = max / denom;
        return max + padding;
      }

      //clears all data
      function resetData() {
        $scope.data = [];
        tempData = [];
      }
  });
