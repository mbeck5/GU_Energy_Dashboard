'use strict';

angular.module('clientApp')
  .controller('CompetitionGraphCtrl', function ($scope, buildingSvc, compEditSvc) {
    $scope.buildingList = [];
    $scope.selectedComp = {};
    $scope.compService = compEditSvc;
    $scope.$watch(compEditSvc.getSelectedComp, function(newVal, oldVal){
      if(newVal != oldVal){
        $scope.selectedComp = compEditSvc.getSelectedComp();
        $scope.api.refresh();
        console.log($scope.selectedComp);
        compEditSvc.getCompBuildingList($scope.selectedComp.cid).then(function(data){
          createBuildingList(data);
        });
      }
    });

    var colorArray = ["#FFD700", "#C0C0C0", "#A5682A", "#0000FF"];

    $scope.data = [
      {
        "key": "DeSmet",
        "values": [
          {
            "label" : "DeSmet",
            "value" : .20
          },
          {
            "label": "Welch",
            "value": 0
          },
          {
            "label": "Alliance",
            "value": 0
          },
          {
            "label" : "Campion",
            "value" : 0
          }
        ]
      },
      {
        "key": "Welch",
        "values": [
          {
            "label" : "DeSmet",
            "value" : 0
          },
          {
            "label": "Welch",
            "value": .16
          },
          {
            "label": "Alliance",
            "value": 0
          },
          {
            "label" : "Campion",
            "value" : 0
          }
        ]
      },
      {
        "key": "Alliance",
        "values": [
          {
            "label" : "DeSmet",
            "value" : 0
          },
          {
            "label": "Welch",
            "value": 0
          },
          {
            "label": "Alliance",
            "value": .14
          },
          {
            "label" : "Campion",
            "value" : 0
          }
        ]
      },
      {
        "key": "Campion",
        "values": [
          {
            "label" : "DeSmet",
            "value" : .0
          },
          {
            "label": "Welch",
            "value": 0
          },
          {
            "label": "Alliance",
            "value": 0
          },
          {
            "label" : "Campion",
            "value" : .05
          }
        ]
      }
    ];

    $scope.options = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 600,
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

    function createBuildingList(data){
      if(data) {
        for (var i = 0; i < data.length; i++) {
          $scope.buildingList[i] = data[i].bid;
        }
      }
    }

    function calcPercentChange(oldVal, newVal){
      var change = newVal - oldVal;
      return -(change / oldVal);
    }

  });
