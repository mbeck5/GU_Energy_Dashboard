'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, $location, buildingSvc) {
      var monthlyView = false; //when changing between monthly and daily tables?
      var selectedResource = 2;
      var unfilteredData = [];
      $scope.selectedBuilding = buildingSvc.getSelectedBuilding();

      getBuildingData();

      $scope.data = [{
        values: [{}],
        key: $scope.selectedBuilding.name
      }];

      $scope.options = {
        chart: {
          type: 'lineChart',
          height: 500,
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
              if (monthlyView) {
                return d3.time.format('%m/%y')(new Date(d))
              }
              else {
                return d3.time.format('%m/%d/%y')(new Date(d))
              }
            }
          },
          yAxis: {
            axisLabel: 'Electricity', //will change dynamically later once we have toggle
            showMaxMin: false,
            axisLabelDistance: 25,
            tickPadding: [10]
          },
          lines: {
            forceY: [0]
          },
          transitionDuration: 250
        }
      };

      $scope.selectResource = function (value) {
        selectedResource = value;
        createGraphData(unfilteredData);
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
      };

      function createGraphData(data){
        //reset
        $scope.data = [{
          values: [{}],
          key: $scope.selectedBuilding.name
        }];

        for (var i = 0; i < data.length; i++) {
          //only display data for selected resource type and if data is not stupid
          if ((data[i].meterTypeId === selectedResource) && isDataValid(data[i].consumption)) {
            $scope.data[0].values.push({x: Date.parse(data[i].date), y: data[i].consumption});
          }
        }
      }

      function getBuildingData() {
        //if going to building page correctly, steal name from url (basically a hack)
        if ($scope.selectedBuilding === 'DESELECTED') {
          $scope.selectedBuilding = {};
          $scope.selectedBuilding.name = $location.path().replace('/buildings/', '');
        }

        //get resource info for building
        buildingSvc.getBuildingData($scope.selectedBuilding.name).then(function (data) {
          unfilteredData = data;
          createGraphData(data);
        });
      }

      //should not have negative or ridiculously high values
      function isDataValid(data) {
        return data > 0 && data < 1000000;
      }
  });
