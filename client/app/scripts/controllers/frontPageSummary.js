'use strict';

angular.module('clientApp')
  .controller('SummaryCtrl', function ($scope, buildingSvc) {
    var isBarClicked = false;
    var resourceIndex = 0;
    var colorArray = ['#FFCC00','#f20000','#1F77B4']; //Electricity, Gas, Water
    var buildingTypes = [];

    var barWater = [{key: "Building Types", values: []}];
    var barElectricity = [{key: "Building Types", values: []}];
    var barGas = [{key: "Building Types", values: []}];

    var waterHash = {};
    var electricityHash = {};
    var gasHash = {};

    getKnobData();
    populateBuildingTypes();
    createBarData();

    var pieBuildingType = [
      {key: "Electricity", y: 0},
      {key: "Gas", y: 0},
      {key: "Water", y: 0}];

    $scope.knobOptions = {
      readOnly: true,
      width: 100
    };

    $scope.knobData = 500;

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
            elementMouseout: function(e) {revertBarToDefault()},
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
          barWater[0].values.push({label: shortenTypeName(data[i].type), value: data[i].total_cons});
      }
    }
    function createBarElectricityData(data){
      //reset
      barElectricity[0].values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barElectricity[0].values.push({label: shortenTypeName(data[i].type), value: data[i].total_cons});
      }
    }
    function createBarGasData(data){
      //reset
      barGas[0].values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barGas[0].values.push({label: shortenTypeName(data[i].type), value: data[i].total_cons});
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
    function getKnobData(){
      buildingSvc.getResourceSum(2).then(function (data){
        $scope.knobData.value = data[0].res_sum;
      });
      //buildingSvc.getResourceSum(3).then(function (data){
      //  $scope.knobData[1] = {value: data[0].res_sum};
      //});
      //buildingSvc.getResourceSum(7).then(function (data){
      //  $scope.knobData[2] = {value: data[0].res_sum};
      //});
    }

    function barClicked(e){
      isBarClicked = !isBarClicked;
    }

    function changeResourceDataOnBarMouseover(e){
      if (!isBarClicked){
        $scope.pieApi.updateWithData(pieBuildingType);
      }
    }

    function revertBarToDefault(){
      if (!isBarClicked) {
        resourceIndex = 0;
        $scope.barApi.updateWithData(barElectricity);
      }
    }

    //TODO: Make it so this function doesn't depend on the order of the character. i.e. Residence Hall/Dormitory can return either Residence or Residence Hall
    function shortenTypeName(buildingType){
      if (buildingType.indexOf(' ') > -1){
        return buildingType.substring(0, buildingType.indexOf(' '));
      }
      else if (buildingType.indexOf('/') > -1){
        return buildingType.substring(0, buildingType.indexOf('/'));
      }
      else if (buildingType.indexOf('\\') > -1){
        return buildingType.substring(0, buildingType.indexOf('\\'));
      }
      else{
        return buildingType;
      }
    }
  });
