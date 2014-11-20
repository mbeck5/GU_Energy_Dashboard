'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, buildingSvc) {
      $scope.selectedBuilding = buildingSvc.getSelectedBuilding();
      $scope.selectedResource = 0;
      $scope.data = [{
        values: [{}],
        key: $scope.selectedBuilding.name
      }];

      $scope.options = {
        chart: {
          type: "lineChart",
          height: 500,
          margin: {
            top: 30,
            right: 75,
            bottom: 50,
            left: 75
          },
          useInteractiveGuideline:true,
          xAxis: {
            axisLabel: "Time",
            showMaxMin: false,
            tickFormat: function(d) {
              return d3.time.format('%m/%d/%y %H:%M:%S')(new Date(d))
            }
          },
          yAxis: {
            axisLabelDistance: 25,
            tickPadding: [10]
          },
          lines: {
            forceY: [0]
          },
          transitionDuration: 250
        }
      };

      //get resource info for building
      buildingSvc.getBuildingData($scope.selectedBuilding.name).then(function (data) {
        createGraphData(data);
      });

      function createGraphData(data){
        //TODO: initialize values
        for (var i = 0; i < data.length; i++) {
          var tempPair = {};
          tempPair.x = Date.parse(data[i].date);
          switch ($scope.selectedResource) {
            case 0: //electricity
              tempPair.y = data[i].electric;
              $scope.options.chart.yAxis.axisLabel = "Electricity";
              break;
            case 1: //water
              tempPair.y = data[i].water;
              $scope.options.chart.yAxis.axisLabel = "Water";
              break;
            case 2: //gas
              tempPair.y = data[i].gas;
              $scope.options.chart.yAxis.axisLabel = "Gas";
              break;
          }
          $scope.data[0].values.push(tempPair);
        }
      }
  });
