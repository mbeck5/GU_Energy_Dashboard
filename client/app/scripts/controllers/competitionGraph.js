'use strict';

angular.module('clientApp')
  .controller('CompetitionGraphCtrl', function ($scope, buildingSvc, compEditSvc) {
    $scope.compareList = [];
    $scope.currentList = [];
    $scope.changeList = [];
    $scope.selectedComp = {};
    $scope.compService = compEditSvc;
    $scope.longestLabel = 0;
    $scope.$watch(compEditSvc.getSelectedComp, function(newVal, oldVal){
      if(newVal != oldVal){
        $scope.longestLabel = 0;
        $scope.selectedComp = compEditSvc.getSelectedComp();
        $scope.api.refresh();
        //Compare to the values from two weeks ago
        var currentStart = $scope.selectedComp.start_date;
        var currentEnd = $scope.selectedComp.end_date;
        var compareStart = moment($scope.selectedComp.start_date).subtract(15, 'days').format();
        if(moment().isAfter(currentEnd) || moment().isSame(currentEnd)){
          var compareEnd = moment($scope.selectedComp.end_date).subtract(15, 'days').format();
        }
        else{
          var daysPassed = moment().diff(currentStart, 'days');
          var compareEnd = moment(compareStart).add(daysPassed, 'days').format();
        }

        $scope.data = [];
        $scope.tempData = [];
        $scope.compareList = [];
        $scope.currentList = [];
        $scope.changeList = [];

        compEditSvc.getBuildingTotals(compareStart, compareEnd, $scope.selectedComp.cid).then(function(data1){
          compEditSvc.getBuildingTotals(currentStart, currentEnd, $scope.selectedComp.cid).then(function(data2){
            createCompareList(data1);
            createCurrentList(data2);
            $scope.options.chart.margin.left = $scope.longestLabel * 6.8;
            calcAllChanges();
            sortChanges();
            createData();
          });
        });
      }
    });

    //Gold, Silver, Bronze, Other
    var colorArray = ["#FFD700", "#ACAFB2", "#CD7F32", "#0000FF"];
    $scope.tempData = [];
    $scope.data = [];

    $scope.options = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 600,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: function(d){ return d.label; },
        y: function(d){ return d.value; },
        showControls: false,
        showValues: true,
        showLegend: false,
        stacked: true,
        transitionDuration: 500,
        tooltips: true,
        color: function(d, i){
          if(i < 3) {
            return colorArray[i];
          }
          else{
            return colorArray[3];
          }
        },
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          axisLabel: "Percent Decreased",
          tickFormat: function(d){
            return d3.format(',.2%')(d);
          }
        },
        tooltipContent: function(key, x, y, e, graph){
          return '<div>' +
            '<style type="text/css">' +
            '.tg  {border-collapse:collapse;border-spacing:0;border-color:#ccc;}' +
            '.tg td{font-family:Arial, sans-serif;font-size:14px;padding:8px 5px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#ccc;color:#333;background-color:#fff;}' +
            '.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#ccc;color:#333;background-color:#f0f0f0;border-bottom-width:2px;border-bottom-color:#f0f0f0}' +
            '.tg .tg-o8k2{font-size:22px;font-family:Arial, Helvetica, sans-serif !important;;background-color:#f9f9f9;text-align:center}' +
            '.tg .tg-431l{font-family:Arial, Helvetica, sans-serif !important;;text-align:center}' +
            '' +
            '</style>' +
            '<table class="tg" style="undefined;">' +
            '<colgroup>' +
              //'<col style="width: 134px">' +
            '</colgroup>' +
            '<tr>' +
            '<th class="tg-o8k2">' + x + '<br></th>' +
            '</tr>' +
            '<tr>' +
            '<td class="tg-431l">' + y  + '</td>' +
            '</tr>' +
            '</table>' +
            '</div>';
        }
      },
      title: {
        enable: true,
        text: function(){
          return $scope.selectedComp.comp_name;
        }
      },
      subtitle: {
        enable: true,
        text: function(){
          return $scope.selectedComp.start_date + '-' + $scope.selectedComp.end_date
        }
      }
    };

    function createCompareList(data){
      if(data) {
        for (var i = 0; i < data.length; i++) {
          var nameLength = data[i].building_name.length;
          if(nameLength > $scope.longestLabel){
            $scope.longestLabel = nameLength;
          }

          $scope.compareList[i] = {building: data[i].building_name, total_cons: data[i].consumption};
        }
      }
    }

    function createCurrentList(data){
      if(data) {
        for (var i = 0; i < data.length; i++) {
          $scope.currentList[i] = {building: data[i].building_name, total_cons: data[i].consumption};
        }
      }
    }

    function calcPercentChange(oldVal, newVal){
      var change = newVal - oldVal;
      return -(change / oldVal);
    }

    function calcAllChanges(){
      if($scope.compareList.length == $scope.currentList.length) {
        for (var i = 0; i < $scope.compareList.length; i++){
          var percentChange = calcPercentChange($scope.compareList[i].total_cons, $scope.currentList[i].total_cons);
          $scope.changeList.push({building: $scope.compareList[i], change: percentChange});
        }
      }
    }

    //Insertion Sort since we aren't sorting a lot buildings (max 30ish?)
    function sortChanges(){
      for(var i = 0; i < $scope.changeList.length; i++){
        var j = i;
        while(j > 0 && $scope.changeList[j-1].change < $scope.changeList[j].change){
          var temp = $scope.changeList[j-1];
          $scope.changeList[j-1] = $scope.changeList[j];
          $scope.changeList[j] = temp;
          j--;
        }
      }
    }

    function createData(){
      for(var i = 0; i < $scope.changeList.length; i++){
        var key = shortenBuildingName($scope.changeList[i].building.building);
        var values = [];
        for(var j = 0; j < $scope.changeList.length; j++){
          var building = shortenBuildingName($scope.changeList[j].building.building);
          if(building === key) {
            values.push({label: building, value: $scope.changeList[i].change})
          }
          else{
            values.push({label: building, value: 0})
          }
        }
        $scope.tempData.push({key: key, values: values});
      }

      $scope.data = $scope.tempData;

    }

    function shortenBuildingName(buildingName){
      if (buildingName.indexOf('(') > -1){
        return buildingName.substring(0, buildingName.indexOf(' '));
      }
      else{
        return buildingName;
      }
    }

  });
