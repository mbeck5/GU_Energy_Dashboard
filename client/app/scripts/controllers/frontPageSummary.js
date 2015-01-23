'use strict';

angular.module('clientApp')
  .controller('SummaryCtrl', function ($scope, buildingSvc) {
    var isBarClicked = false;
    var isPieClicked = false;
    var buildingTypes = [];
    var colorArray = ['#2ca02c','#ff7f0e','#1F77B4']; //Electricity, Gas, Water

    buildingSvc.getBuildingTypes().then(function(data) {
      buildingTypes = data;
      console.log(buildingTypes);
    });

    var barWater = [{
      key: "Buildings",
      values: [
        {
          label: "Barc",
          value: 80
        },
        {
          label: "Alliance",
          value: 321
        },
        {
          label: "Campion",
          value: 123
        },
        {
          label: "Paccar",
          value: 641
        },
        {
          label: "Herak",
          value: 986
        }
      ]
    }];

    var defaultBar = [{
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
      }];

    var defaultPie = [
      {key: "Electricity", y: 200},
      {key: "Gas", y: 130},
      {key: "Water", y: 186}
    ];

    var barcPie = [
      {key: "Electricity", y: 100},
      {key: "Gas", y: 330},
      {key: "Water", y: 86}
    ]

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
        pieLabelsOutside: true,
        labelThreshold: 0.01,
        tooltips: true,
        interactive: true,
        pie: {
          dispatch: {
            elementClick: function(e) {pieClicked()},
            elementMouseout: function(e) {revertBarToDefault()},
            elementMouseover: function(e) {changeResourceDataOnPieMouseover(e.label)}
          }
        }
      }
    };

    $scope.pieData = defaultPie;

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
        //xAxis: {
        //  axisLabel: 'X Axis'
        //},
        yAxis: {
          axisLabel: 'Y Axis'
        },
        showYAxis: false,
        discretebar: {
          dispatch: {
            elementClick: function(e) {barClicked(e)},
            elementMouseout: function(e) {revertPieToDefault()},
            elementMouseover: function(e) {changeResourceDataOnBarMouseover(e.point.label)}
          }
        }
      }
    };

    $scope.barData = defaultBar;

    function pieClicked(e){
      if(!isBarClicked) {
        isPieClicked = !isPieClicked;
      }
    }
    function barClicked(e){
      if(!isPieClicked) {
        isBarClicked = !isBarClicked;
      }
    }


    function changeResourceDataOnPieMouseover(resourceName){
      if (!isPieClicked && !isBarClicked){
        if (resourceName == "Water") {
          $scope.barApi.updateWithData(barWater)
        }
      }
    }
    function changeResourceDataOnBarMouseover(barName){
      if (!isPieClicked && !isBarClicked){
        if (barName == "Barc"){
          $scope.pieApi.updateWithData(barcPie);t
        }
      }
    }

    function revertPieToDefault() {
      if (!isPieClicked && !isBarClicked) {
        $scope.pieApi.updateWithData(defaultPie);
      }
    }
    function revertBarToDefault(){
      if (!isPieClicked && !isBarClicked) {
        $scope.barApi.updateWithData(defaultBar);
      }
    }

  });
