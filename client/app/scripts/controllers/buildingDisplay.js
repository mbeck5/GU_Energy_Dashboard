'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, $location, buildingSvc) {
      var selectedResource = 2; //default resource
      var savedData = [];  //save downloaded data to avoid downloading
      $scope.selectedBuilding = buildingSvc.getSelectedBuilding();

      getBuildingData();  //initial call to get data of default type

      $scope.data = [{
        values: [{}],
        key: $scope.selectedBuilding.name
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
          transitionDuration: 500
        }
      };

      $scope.selectResource = function (resourceType) {
        selectedResource = resourceType;

        //get data for selected resource if not saved
        if (!savedData[resourceType]) {
          getBuildingData();
        }
      };

      function createGraphData(data){
        //reset
        $scope.data[0].values = [{}];

        //create graph points
        for (var i = 0; i < data.length; i++) {
          $scope.data[0].values.push({x: Date.parse(data[i].date), y: data[i].consumption});
        }
      }

      function getBuildingData() {
        //if going to building page directly or refreshing, steal name from url (basically a hack)
        if ($scope.selectedBuilding === 'DESELECTED') {
          var tempName = $location.path().replace('/buildings/', '').replace('--', '/');

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
        savedData[selectedResource] = data;
        createGraphData(data);
        setResourceLabel();
        setFocusArea();
      }

      function setResourceLabel() {
        switch (selectedResource) {
          case 2:
            $scope.options.chart.yAxis.axisLabel = 'Electricity';
            break;
          case 3:
            $scope.options.chart.yAxis.axisLabel = 'Gas';
            break;
          default:
            $scope.options.chart.yAxis.axisLabel = 'Whatever';
            break;
        }
      }

      //sets initial "zoom" view over specified area
      function setFocusArea() {
        //creating focus coordinates
        var curDate = new Date();
        var prevDate = new Date();
        prevDate.setMonth(prevDate.getMonth() - 1);

        //not sure why we have to wait...
        setTimeout(function () {
          var chart = $scope.api.getScope().chart;  //get chart from view
          chart.brushExtent([prevDate, curDate]);
          $scope.api.update();
        }, 500);
      }
  });
