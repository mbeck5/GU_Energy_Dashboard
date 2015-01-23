'use strict';

angular.module('clientApp')
  .controller('SummaryCtrl', function ($scope, buildingSvc) {
    var isBarClicked = false;
    var isPieClicked = false;
    var buildingTypes = [];
    var colorArray = ['#2ca02c','#ff7f0e','#1F77B4']; //Electricity, Gas, Water

    var barWater = [{key: "Building Types", values: []}];
    var barElectricity = [{key: "Building Types", values: []}];
    var barGas = [{key: "Building Types", values: []}];

    createBarData();


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

    function createBarWaterData(data){
      //reset
      barWater.values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barWater.values.push({label: data[i].building_type, values: data[i].total_cons});
      }
    }
    function createBarElectricityData(data){
      //reset
      barElectricity.values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barElectricity.values.push({label: data[i].building_type, values: data[i].total_cons});
      }
    }
    function createBarGasData(data){
      //reset
      barGas.values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barGas.values.push({label: data[i].building_type, values: data[i].total_cons});
      }
    }
    function createBarData(){
      buildingSvc.getResourcesByType(7).then(function (data){
        createBarWaterData(data);
      });
      buildingSvc.getResourcesByType(2).then(function (data){
        createBarElectricityData(data);
      });
      buildingSvc.getResourcesByType(3).then(function (data){
        createBarGasData(data);
      });
    }


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
        else if(resourceName == "Gas") {
          $scope.barApi.updateWithData(barGas);
        }
        else if(resourceName == "Electricity"){
          $scope.barApi.updateWithData(barElectricity);
        }
        else{
          console.log("DO BETTER ERROR CHECKING");
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
