'use strict';

angular.module('clientApp', ['angularSpinner'])
  .controller('BuildingDisplayCtrl', function ($scope, $location, $timeout, buildingSvc) {
      var selectedResource = 2; //default resource
      var savedData = [];  //save downloaded data to avoid downloading
      var colorMap = {2: '#FFCC00', 3: '#F20000', 7: '#1F77B4'};
      var spinnerset = false;
      $scope.selectedBuilding = buildingSvc.getSelectedBuilding();

      getBuildingData();  //initial call to get data of default type

      $scope.data = [{
        values: [{}],
        key: $scope.selectedBuilding.name,
        color: colorMap[selectedResource]
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
          noData: 'No Data Available for Selected Resource'
        },
        title: {
          enable: true,
          text: 'Daily Electricity Usage'
        }
      };

      $scope.selectResource = function (resourceType) {
        savedData[selectedResource] = $scope.data[0].values;
        selectedResource = resourceType;

        //get data for selected resource if not saved
        if (!savedData[resourceType]) {
          getBuildingData();
        }
        else {
          initGraph(null);
        }
      };

      function createGraphData(data){
        //reset
        $scope.data[0].values = [];

        if (data) {
          //create graph points
          $scope.data[0].values = new Array(data.length);
          for (var i = 0; i < data.length; i++) {
            $scope.data[0].values[i] = {x: Date.parse(data[i].date), y: data[i].consumption};
          }
        }
        else {
          $scope.data[0].values = savedData[selectedResource];
        }
      }

      function getBuildingData() {
        //if going to building page directly or refreshing, steal name from url (basically a hack)
        spinnerset = true;
        if ($scope.selectedBuilding === 'DESELECTED') {
          var tempName = $location.path().replace('/buildings/', '').replace('--', '/');
          $scope.selectedBuilding = {};
          $scope.selectedBuilding.name = tempName;

          //get resource info for building from name rather than ID
          buildingSvc.getBuildingDataFromName(tempName, selectedResource).then(function (data) {
            initGraph(data);
          });
        }

        //if coming from the building select page
        else {
          //get resource info for building
          buildingSvc.getBuildingData($scope.selectedBuilding.id, selectedResource).then(function (data) {
            initGraph(data);
          });
        }

      }

      //called once data is retrieved
      function initGraph(data) {
        createGraphData(data);
        setResourceLabel();
        setFocusArea();
      }

      function setResourceLabel() {
        $scope.data[0].color = colorMap[selectedResource];
        switch (selectedResource) {
          case 2:
            $scope.options.chart.yAxis.axisLabel = 'Electricity';
            $scope.options.title.text = 'Daily Electricity Usage';
            break;
          case 3:
            $scope.options.chart.yAxis.axisLabel = 'Gas';
            $scope.options.title.text = 'Daily Gas Usage';
            break;
          //Ask why this is 18
          //case 7:
            //$scope.options.chart.yAxis.axisLabel = 'Water';
            //$scope.options.title.text = 'Daily Water Usage';
            //$scope.options.chart.color = '#1F77B4';
          default:
            $scope.options.chart.yAxis.axisLabel = 'Whatever';
            $scope.options.title.text = 'Daily Whatever Usage';
            break;
        }
      }

      //sets initial "zoom" view over specified area
      function setFocusArea() {
        //creating focus coordinates
        var curDate = new Date();
        var prevDate = new Date();
        curDate.setMonth(curDate.getMonth() - 4);   //TODO: change to real values later
        prevDate.setMonth(prevDate.getMonth() - 5);

        //this is actually the right way to do this
        $timeout(function() {
          var chart = $scope.api.getScope().chart;  //get chart from view
          chart.brushExtent([prevDate, curDate]);
          $scope.api.update();
        });
      }
      $scope.startSpin = function(){
        usSpinnerService.spin('spinner-graph');
      };
      $scope.stopSpin = function(){
        usSpinnerService.stop('spinner-graph');
      };
  });
