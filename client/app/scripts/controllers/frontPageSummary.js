'use strict';

angular.module('clientApp')
  .controller('SummaryCtrl', function ($scope) {
    var colorArray = ['#FFFF00','#00FF00','#0000FF']

    $scope.pieOptions = {
      chart: {
        type: 'pieChart',
        height: 500,
        x: function(d){return d.key;},
        y: function(d){return d.y;},
        showLabels: true,
        transitionDuration: 500,
        color: function(d, i){return colorArray[i]},
        labelType: "percent",
        pieLabelsOutside: false,
        labelThreshold: 0.01,
        tooltips: true
      }
    };

    $scope.pieData = [
      {key: "Electricity", y: 200},
      {key: "Gas", y: 130},
      {key: "Water", y: 186}
    ];

    $scope.barOptions = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        showValues: true,
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'X Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis'
        }
      }
    };

    $scope.barData = [
      {
        key: "Buildings",
        values: [
          {
            label: "Barc",
            value: 1304
          },
          {
            label: "Alliance",
            value: 502
          },
          {
            label: "Campion",
            value: 1300
          },
          {
            label: "Paccar",
            value: 164
          },
          {
            label: "Herak",
            value: 869
          }
        ]
      }
    ]

  });
