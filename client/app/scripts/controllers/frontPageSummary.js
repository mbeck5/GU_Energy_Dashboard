'use strict';

angular.module('clientApp')
  .controller('SummaryCtrl', function ($scope, buildingSvc) {
    var isBarClicked = false;
    var isPieClicked = false;
    var resourceIndex = 0;
    var colorArray = ['#2ca02c','#ff7f0e','#1F77B4']; //Electricity, Gas, Water
    var buildingTypes = [];

    var barWater = [{key: "Building Types", values: []}];
    var barElectricity = [{key: "Building Types", values: []}];
    var barGas = [{key: "Building Types", values: []}];

    var waterHash = {};
    var electricityHash = {};
    var gasHash = {};

    populateBuildingTypes();
    createBarData();

    var pieDefault = [
      {key: "Electricity", y: 0},
      {key: "Gas", y: 0},
      {key: "Water", y: 0}];

    var pieBuildingType = [
      {key: "Electricity", y: 0},
      {key: "Gas", y: 0},
      {key: "Water", y: 0}];

    createPieDefault();

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
            elementClick: function(e) {pieClicked(e)},
            elementMouseout: function(e) {revertBarToDefault()},
            elementMouseover: function(e) {changeResourceDataOnPieMouseover(e)}
          }
        }
      }
    };

    $scope.pieData = pieDefault;

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
        color: function(d, i) {return colorArray[resourceIndex]},
        discretebar: {
          dispatch: {
            elementClick: function(e) {barClicked(e)},
            elementMouseout: function(e) {revertPieToDefault()},
            elementMouseover: function(e) {changeResourceDataOnBarMouseover(e)}
          }
        }
      }
    };

    $scope.barData = barElectricity;

    function populateBuildingTypes(){
      buildingSvc.getBuildingTypes().then(function (data){
        for(var i = 0; i < data.length; i++) {
          buildingTypes.push(data[i].BUILDING_TYPE);
        }
      })
    }

    function createBarWaterData(data){
      //reset
      barWater[0].values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
          barWater[0].values.push({label: data[i].type, value: data[i].total_cons});
      }
    }
    function createBarElectricityData(data){
      //reset
      barElectricity[0].values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barElectricity[0].values.push({label: data[i].type, value: data[i].total_cons});
      }
    }
    function createBarGasData(data){
      //reset
      barGas[0].values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barGas[0].values.push({label: data[i].type, value: data[i].total_cons});
      }
    }
    function createBarData(){
      buildingSvc.getResourceByType(7).then(function (data){
        createBarWaterData(data);
        createWaterHash();
      });
      buildingSvc.getResourceByType(2).then(function (data){
        createBarElectricityData(data);
        createElectricityHash();
      });
      buildingSvc.getResourceByType(3).then(function (data){
        createBarGasData(data);
        createGasHash();
      });
    }
    function createWaterHash() {
      if (barWater[0].values.length > 0) {
        for (var i = 0; i < barWater[0].values.length; i++) {
          waterHash[barWater[0].values[i].label] = barWater[0].values[i].value;
        }
      }
    }
    function createElectricityHash() {
      if (barElectricity[0].values.length > 0) {
        for (var i = 0; i < barElectricity[0].values.length; i++) {
          electricityHash[barElectricity[0].values[i].label] = barElectricity[0].values[i].value;
        }
      }
    }
    function createGasHash(){
      if(barGas[0].values.length > 0) {
        for (var i = 0; i < barGas[0].values.length; i++) {
          gasHash[barGas[0].values[i].label] = barGas[0].values[i].value;
        }
      }
    }

    //This function throws 3 exceptions per building service call
    function createPieDefault(){
      buildingSvc.getResourceSum(2).then(function (data){
        pieDefault[0].y = data[0].res_sum;
      });
      buildingSvc.getResourceSum(3).then(function (data){
        pieDefault[1].y = data[0].res_sum;
      });
      buildingSvc.getResourceSum(7).then(function (data){
        pieDefault[2].y = data[0].res_sum;
      });
    }
    function createPieType(buildingType){
      var elec = 0;
      var gas = 0;
      var water = 0;

      if(elec = electricityHash[buildingType]);
      else{elec = 0}

      if(gas = gasHash[buildingType]);
      else{gas = 0}

      if(water = waterHash[buildingType]);
      else{water = 0}

      pieBuildingType[0].y = elec;
      pieBuildingType[1].y = gas;
      pieBuildingType[2].y = water;
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

    function changeResourceDataOnPieMouseover(e){
      var resourceName = e.label;
      resourceIndex = e.pointIndex;
      if (!isPieClicked && !isBarClicked){
        if (resourceName == "Water") {
          $scope.barApi.updateWithData(barWater);
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
    function changeResourceDataOnBarMouseover(e){
      if (!isPieClicked && !isBarClicked){
        createPieType(e.point.label);
        $scope.pieApi.updateWithData(pieBuildingType);
      }
    }

    function revertPieToDefault() {
      if (!isPieClicked && !isBarClicked) {
        $scope.pieApi.updateWithData(pieDefault);
      }
    }
    function revertBarToDefault(){
      if (!isPieClicked && !isBarClicked) {
        resourceIndex = 0;
        $scope.barApi.updateWithData(barElectricity);
      }
    }
  });
