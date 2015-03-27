'use strict';

angular.module('clientApp')
  .controller('SummaryCtrl', function ($scope, buildingSvc) {
    var colorArray = ['#FFCC00','#f20000','#1F77B4']; //Electricity, Gas, Water
    var buildingTypes = [];
    var barWater = {key: "Water", values: []};
    var barElectricity = {key: "Electricity", values: []};
    var barGas = {key: "Gas", values: []};
    $scope.selectedKnobTime = 'Day';  //day or year
    $scope.isKnobYearly = false;

    getKnobData(false);
    populateBuildingTypes();
    createBarData();

    $scope.knobData = [];

    $scope.barOptions = {
      chart: {
        type: 'multiBarChart',
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
        showControls: false,
        color: function(d, i) {return colorArray[i]}
      }
    };

    $scope.barData = [barElectricity, barGas, barWater];

    //when user hits the toggle for the knobs
    $scope.toggleKnobs = function() {
      //the model may not update immediately, so the logic below may not make sense, but it works
      if ($scope.isKnobYearly) {
        getKnobData(false);
        $scope.selectedKnobTime = 'Day';
      }
      else {
        getKnobData(true);
        $scope.selectedKnobTime = 'Year';
      }
    };

    function populateBuildingTypes(){
      buildingSvc.getBuildingTypes().then(function (data){
        for(var i = 0; i < data.length; i++) {
          buildingTypes.push(data[i].BUILDING_TYPE);
        }
      })
    }

    function createBarWaterData(data){
      //reset
      barWater.values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
          barWater.values.push({label: shortenTypeName(data[i].type), value: data[i].total_cons});
      }
    }
    function createBarElectricityData(data){
      //reset
      barElectricity.values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barElectricity.values.push({label: shortenTypeName(data[i].type), value: data[i].total_cons});
      }
    }
    function createBarGasData(data){
      //reset
      barGas.values = [];
      //create data points
      for (var i = 0; i < data.length; i++) {
        barGas.values.push({label: shortenTypeName(data[i].type), value: data[i].total_cons});
      }
    }
    function createBarData(){
      var date = moment().subtract(1, 'days').format('YYYY/MM/DD'); //previous date
      buildingSvc.getResourceByType(7, date).then(function (data){
        createBarWaterData(data);
      });
      buildingSvc.getResourceByType(2, date).then(function (data){
        createBarElectricityData(data);
      });
      buildingSvc.getResourceByType(3, date).then(function (data){
        createBarGasData(data);
      });
    }

    //This function throws 3 exceptions per building service call
    //calculates percent change
    function getKnobData(compareLastYear){
      var end = moment().subtract(1, 'days').format('YYYY/MM/DD'); //previous date
      var start;

      if (!compareLastYear)
        start = moment().subtract(2, 'days').format('YYYY/MM/DD'); //day before last
      else
        start = moment().subtract(1, 'days').subtract(1, 'years').format('YYYY/MM/DD'); //year ago

      buildingSvc.getResourceSum(2, end).then(function (data){
        buildingSvc.getResourceSum(2, start).then(function (data2){
          $scope.knobData[0] = data[0].res_sum / data2[0].res_sum * 100;
        });
      });
      buildingSvc.getResourceSum(3, end).then(function (data){
        buildingSvc.getResourceSum(3, start).then(function (data2){
          $scope.knobData[1] = data[0].res_sum / data2[0].res_sum * 100;
        });
      });
      buildingSvc.getResourceSum(7, end).then(function (data){
        buildingSvc.getResourceSum(7, start).then(function(data2){
          $scope.knobData[2] = data[0].res_sum / data2[0].res_sum * 100;
        });
      });
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
