'use strict';

angular.module('clientApp')
  .controller('BuildingDisplayCtrl', function ($scope, buildingSvc) {
      $scope.selectedBuilding = buildingSvc.getSelectedBuilding();
      $scope.selectedResource = 0;
      $scope.data = [{
        values: [{}]
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
            axisLabel: "Time"
          },
          yAxis: {
            axisLabel: "Water",
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
              break;
            case 1: //water
              tempPair.y = data[i].water;
              break;
            case 2: //gas
              tempPair.y = data[i].gas;
              break;
          }
          $scope.data[0].values.push(tempPair);
        }
      }
  });
